---
title: 'ripgrep: Cheat Sheet'
publicationDate: '2020-04-19'
tags: 'Cheat Sheet'
---

Learn essential commands for fast and efficient text searching across multiple files and directories with this quick
reference guide. Perfect for developers and system administrators!

---

Ripgrep is a line-oriented search tool that recursively searches directories for a regex pattern. It is known for its
speed and efficiency.

## Install

```bash
brew install ripgrep
```

## Search

### Supported File Types

Shows all supported file types that can be used as filter during search rather than using regex to limit to file types

```bash
rg --type-list
```

To limit search by file type use the name with `-t` option.

```bash
rg -t clojure 'foo'
```

### Follow Symlinks

Follow any symlinks using the `-L` or `--follow` options:

```bash
rg -L 'foo'
```

### With Context
