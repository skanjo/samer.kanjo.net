---
layout: layouts/base.liquid
title: ripgrep
---

# ripgrep

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
