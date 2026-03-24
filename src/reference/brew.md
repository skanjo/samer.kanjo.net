---
title: Managing packages with Homebrew
---

## Installing

Formulae are packages built from source (e.g. `git`, `jq`). Casks are packages distributed as native macOS installers
(`.dmg`, `.pkg`) — often GUI apps like 1Password but also CLI tools like Claude Code.

Install a formula:

```bash
brew install [formula]
```

Install a cask:

```bash
brew install --cask [cask]
```

## Listing

List installed packages with version numbers:

```bash
brew list --versions
```

List packages that are not dependencies of another (top-level installs):

```bash
brew leaves
```

List installed casks (not included in `brew leaves`):

```bash
brew list --cask
```

Show info about a formula:

```bash
brew info [formula]
```

Show dependencies for all installed formulae:

```bash
brew deps --installed
```

Show dependencies as a tree:

```bash
brew deps --installed --tree
```

Check which installed formulae depend on a given formula:

```bash
brew uses --installed [formula]
```

## Updating

Fetch the latest Homebrew and formula definitions:

```bash
brew update
```

Check which installed formulae have newer versions available:

```bash
brew outdated --verbose
```

Upgrade all outdated formulae:

```bash
brew upgrade
```

## Backup and Restore

Export all installed formulae, casks, and taps to a `Brewfile`:

```bash
brew bundle dump
```

Use `--force` to overwrite an existing `Brewfile`:

```bash
brew bundle dump --force
```

Restore from a `Brewfile`:

```bash
brew bundle install
```

## Removing

Uninstall a formula and all its older versions:

```bash
brew remove --force [formula]
```

## Cleanup

Dry run — show what cleanup would remove:

```bash
brew cleanup -ns
```

Remove old versions and scrub the download cache:

```bash
brew cleanup -s
```
