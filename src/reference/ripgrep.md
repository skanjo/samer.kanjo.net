---
title: Searching text with ripgrep
---

## Install

```bash
brew install ripgrep
```

## Searching

Basic recursive search:

```bash
rg 'pattern'
```

Limit search to a file type:

```bash
rg -t clojure 'pattern'
```

List all supported file types:

```bash
rg --type-list
```

Follow symlinks:

```bash
rg -L 'pattern'
```

## Context

Show N lines before and after each match:

```bash
rg -C 3 'pattern'
```

Show N lines before each match:

```bash
rg -B 3 'pattern'
```

Show N lines after each match:

```bash
rg -A 3 'pattern'
```
