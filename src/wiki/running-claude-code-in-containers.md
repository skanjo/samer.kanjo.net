---
title: Running Claude Code autonomously in Apple containers
---

A guide to using macOS containerization to give Claude Code a sandboxed, autonomous environment for iterating on a
codebase.

## Prerequisites

- **macOS 15 (Sequoia)** or later (macOS 26 Tahoe for full native support)
- **Apple Silicon** (M1, M2, M3, M4)
- **Apple `container` CLI** — installed separately via Homebrew or GitHub (see Step 1)
- **Claude Code CLI** (`claude`) installed via npm

## Overview

Apple native containers use the Virtualization framework to run lightweight Linux VMs with container semantics. They
boot in under a second, share the host kernel's hypervisor, and support bind-mounting host directories. This makes them
a good fit for giving Claude Code a controlled environment without the overhead of a full VM.

The basic idea:

1. Build a container image with the tools Claude needs (git, language runtimes, etc.)
2. Bind-mount your git repo from the host into the container
3. Optionally give the container network access to localhost (for PostgreSQL in Docker)
4. Run Claude Code inside the container in autonomous/dangermode
5. Review the commits Claude made on the mounted repo

## Step 1: Install the Container CLI

The `container` CLI is not bundled with macOS — it's a separate install from Apple's open-source project. Requires Apple
Silicon (M1+) and macOS 15 or later.

**Option A: Homebrew**

```bash
brew install container
```

**Option B: GitHub releases**

Download the `.pkg` installer from
https://github.com/apple/container/releases and run it.

**After installing**, start the background service and verify:

```bash
container system start
container --version
```

## Step 2: Create a Containerfile (Dockerfile equivalent)

Apple containers run Linux images. You build images with a `Containerfile` (same syntax
as Dockerfile). Create one with the tools Claude Code needs:

```dockerfile
FROM ubuntu:24.04

# Core tools
RUN apt-get update && apt-get install -y \
    git \    curl \    build-essential \    sqlite3 \    libsqlite3-dev \    postgresql-client \    ca-certificates \    gnupg \    && rm -rf /var/lib/apt/lists/*
# Node.js (for Claude Code CLI)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs
# Install Claude Code CLI
RUN npm install -g @anthropic-ai/claude-code

# Configure git identity for commits
RUN git config --global user.name "Claude" \
    && git config --global user.email "claude@localhost"
# Working directory where repo will be mounted
WORKDIR /workspace
```

Build the image:

```bash
container build --tag claude-sandbox .
```

## Step 3: Run the Container with a Mounted Repo

Bind-mount your git repo so Claude's commits persist on the host:

```bash
container run \
  --name claude-worker \
  --mount "type=bind,source=/path/to/your/repo,target=/workspace" \
  --interactive \
  claude-sandbox \
  /bin/bash
```

Key flags:
- `--mount type=bind,source=...,target=...` — mounts your host repo into `/workspace`
- `--interactive` — gives you a shell to set things up before handing off to Claude

### File Ownership

Apple native containers automatically map root (uid 0) inside the container to your host
user, so file ownership on the bind mount is not an issue by default. If you run the
container as a non-root user and hit permission problems, the fix is to run as root:

```bash
container run --user root ...
```

## Step 4: Database Access

### Option A: SQLite (simplest)

SQLite needs no setup — the database file lives inside the mounted repo or workspace.
Claude can create and use `.sqlite3` / `.db` files directly.

### Option B: PostgreSQL via Docker on the Host

Your host is already running PostgreSQL in Docker. The container needs network access to
reach it.

Apple containers support host networking. From inside the container, the host's Docker
PostgreSQL is reachable at the host gateway IP:

```bash
# Inside the container, the host is typically reachable at:
#   - host.containers.internal (if Apple provides this, similar to Docker's host.docker.internal)
#   - Or the host's IP on the bridge network

# Test connectivity
psql -h host.containers.internal -U postgres -d your_database
```

If host DNS resolution isn't available, find the host IP and pass it as an env var:

```bash
container run \
  --env "DATABASE_HOST=192.168.64.1" \
  --mount "type=bind,source=/path/to/repo,target=/workspace" \
  claude-sandbox \
  /bin/bash
```

Grant the container's user permissions in PostgreSQL:

```sql
-- On your Docker PostgreSQL instance
CREATE ROLE claude_sandbox WITH LOGIN PASSWORD 'sandbox' CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE your_database TO claude_sandbox;
```

## Step 5: Network Access Control

To limit Claude's external access (allow package registries, block everything else), you have a few options:

### Option A: No Network (strictest)

Run the container with no network access. Pre-install all dependencies in the image.

```bash
container run --network none \
  --mount "type=bind,source=/path/to/repo,target=/workspace" \
  claude-sandbox /bin/bash
```

This is the safest option. It means Claude cannot fetch packages at runtime, so bake
everything into the Containerfile.

### Option B: Selective Access via Squid Proxy

Run a filtering HTTP proxy inside the container that only allows requests to a whitelist
of domains. Squid is a good fit — it's lightweight, well-documented, and available in
the Ubuntu package repos.

**1. Add Squid to the Containerfile:**

```dockerfile
RUN apt-get update && apt-get install -y squid && rm -rf /var/lib/apt/lists/*
```

**2. Create a whitelist config (`squid-whitelist.conf`):**

```squid
# Allowed domains
acl allowed_domains dstdomain .hex.pm
acl allowed_domains dstdomain .hexdocs.pm
acl allowed_domains dstdomain .npmjs.org
acl allowed_domains dstdomain .github.com
acl allowed_domains dstdomain .githubusercontent.com
acl allowed_domains dstdomain .elixir-lang.org
acl allowed_domains dstdomain .erlang.org

# Allow localhost (for PostgreSQL on host)
acl localhost_access dst 127.0.0.0/8
acl localhost_access dst 192.168.64.0/24

# Allow CONNECT for HTTPS on port 443
acl SSL_ports port 443
acl CONNECT method CONNECT

# Rules: allow whitelisted domains and localhost, deny everything else
http_access allow localhost_access
http_access allow CONNECT SSL_ports allowed_domains
http_access allow allowed_domains
http_access deny all

# Listen on port 3128
http_port 3128
```

**3. Copy the config into the image:**

```dockerfile
COPY squid-whitelist.conf /etc/squid/squid.conf
```

**4. Create an entrypoint script (`entrypoint.sh`) that starts Squid, then runs Claude:**

```bash
#!/bin/bash
set -e

# Start Squid in the background
squid -f /etc/squid/squid.conf
sleep 1  # let it initialize

# Route all HTTP traffic through the proxy
export http_proxy=http://127.0.0.1:3128
export https_proxy=http://127.0.0.1:3128
export HTTP_PROXY=http://127.0.0.1:3128
export HTTPS_PROXY=http://127.0.0.1:3128

# Hand off to whatever command was passed
exec "$@"
```

```dockerfile
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

**5. Run it:**

```bash
container run \
  --mount "type=bind,source=/path/to/your/repo,target=/workspace" \
  --mount "type=bind,source=$HOME/.claude-container,target=/root/.claude" \
  claude-sandbox \
  sh -c 'cd /workspace && claude --dangerously-skip-permissions --print --prompt "..."'
```

Claude's HTTP requests go through Squid. Anything not on the whitelist gets denied.
Adjust the `allowed_domains` ACL to add or remove sites as needed.

**Note:** The Anthropic API (`api.anthropic.com`) must also be whitelisted for Claude
Code to function:

```squid
acl allowed_domains dstdomain .anthropic.com
```

A practical alternative: allow full network during image build (to install deps), then use this proxy approach at
runtime when Claude is actually working.

### Option C: Full Network (least restrictive)

Default behavior — the container has full network access. Only use this if you trust the scope of work.

## Step 6: Authenticate and Run Claude Code Autonomously

If you use a Claude subscription (not an API key), you need to authenticate inside the container before running
autonomously. This is a two-step process: log in interactively once, then kick off the autonomous run.

### Step 6a: Log in to Claude

Start the container interactively:

```bash
container run \
  --name claude-worker \
  --interactive \
  --mount "type=bind,source=/path/to/your/repo,target=/workspace" \
  claude-sandbox \
  /bin/bash
```

Inside the container, run the login flow:

```bash
claude login
```

This opens a browser-based OAuth flow. The auth credentials are stored in the
container's `~/.claude/` directory. If you want these to persist across container runs,
bind-mount a host directory to preserve them:

```bash
container run \
  --mount "type=bind,source=/path/to/your/repo,target=/workspace" \
  --mount "type=bind,source=$HOME/.claude-container,target=/root/.claude" \
  claude-sandbox \
  /bin/bash
```

This way you only need to log in once — future container runs reuse the stored session.

### Step 6b: Run autonomously

Once authenticated, run Claude in headless mode:

```bash
cd /workspace
claude --dangerously-skip-permissions \
  --print \
  --prompt "Read docs/SPEC.md for the full specification. Implement the features described there. Commit your changes as you complete each feature. Use small, focused commits with clear messages."
```

Or combine login persistence and autonomous run in one command:

```bash
container run \
  --mount "type=bind,source=/path/to/your/repo,target=/workspace" \
  --mount "type=bind,source=$HOME/.claude-container,target=/root/.claude" \
  claude-sandbox \
  sh -c 'cd /workspace && claude --dangerously-skip-permissions --print --prompt "..."'
```

### Using an API key instead

If you have an Anthropic API key, you can skip the login step entirely and pass it as an
environment variable:

```bash
container run \
  --mount "type=bind,source=/path/to/your/repo,target=/workspace" \
  --env "ANTHROPIC_API_KEY=sk-ant-..." \
  claude-sandbox \
  sh -c 'cd /workspace && claude --dangerously-skip-permissions --print --prompt "..."'
```

### Flags explained:
- `--dangerously-skip-permissions` — no tool approval prompts (safe because we're in a container)
- `--print` — non-interactive, prints output and exits when done
- `--prompt` — the instruction to execute

### Alternative: Use a prompt file

```bash
claude --dangerously-skip-permissions \    --print \    --prompt "$(cat /workspace/docs/AUTONOMOUS_PROMPT.md)"
```

## Step 7: Review the Results

After Claude finishes, the commits are on your host repo (since it's bind-mounted):

```bash
# On your host machine
cd /path/to/your/repo
git log --oneline  # See what Claude committed
git diff main      # Review all changes
```

You can create a branch before running Claude to isolate its work:

```bash
# Before starting the container
cd /path/to/your/repo
git checkout -b claude/feature-name

# After Claude finishes, review on the host
git log main..claude/feature-name
```

## Putting It All Together: One-Liner

```bash
# Prep: create a branch for Claude's work
cd /path/to/your/repo && git checkout -b claude/iteration-12

# Run Claude in a container (uses persisted login from ~/.claude-container)
container run \
  --mount "type=bind,source=/path/to/your/repo,target=/workspace" \
  --mount "type=bind,source=$HOME/.claude-container,target=/root/.claude" \
  claude-sandbox \
  sh -c 'cd /workspace && claude --dangerously-skip-permissions --print --prompt "Read docs/SPEC.md and docs/PLAN.md. Implement the next incomplete iteration. Commit after each logical unit of work."'
# Review on host
cd /path/to/your/repo && git log --oneline claude/iteration-12
```

## Tips

- **Bake dependencies into the image.** The less Claude needs to install at runtime, the faster and more reliable
  autonomous runs will be. For an Elixir project, include Erlang/OTP and Elixir in the Containerfile.
- **Include a CLAUDE.md** in your repo with project conventions, build commands, and test instructions — Claude reads
  this automatically.
- **Set a timeout.** Wrap the `container run` with `timeout` to prevent runaway sessions:
  ```bash
  timeout 30m container run ...
  ```
- **Check container logs.** If Claude exits unexpectedly, inspect output for errors.
- **Iterate on the Containerfile.** Start minimal, add tools as Claude's output reveals what it needs.
- **Use `--max-turns`** to limit how many back-and-forth turns Claude takes, preventing infinite loops:
  ```bash
  claude --dangerously-skip-permissions --print --max-turns 50 --prompt "..."
  ```

## Security Considerations

- The bind mount gives the container **read-write access** to your repo. Claude can modify or delete any file in it. Use
  a dedicated branch and verify before merging.
- The `--dangerously-skip-permissions` flag is only safe **inside an isolated container**. Never use it on your host
  machine for autonomous runs.
- If using PostgreSQL, scope the database role to only the databases Claude needs. Don't give it superuser access.
- Review all commits before merging. Autonomous code generation requires human review.

## Caveats

- Apple native containers are new (macOS 26). The CLI and capabilities may evolve. Check Apple's latest documentation
  for current syntax and features.
- These containers run Linux, not macOS. Your Elixir/Phoenix app will build and run fine (Linux is the standard
  deployment target), but macOS-specific tools won't be available.
- Large Elixir/OTP compilations inside the container may be slower than native. Consider pre-compiling deps in the
  image.
