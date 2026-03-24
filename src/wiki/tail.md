---
title: Reading file endings with tail
---

Last 10 lines (default):

```bash
tail file.log
```

Last N lines:

```bash
tail -50 file.log
```

Follow a file (monitor for new lines):

```bash
tail -f file.log
```

Follow with initial context of N lines:

```bash
tail -10f file.log
```

Skip the first N lines (useful for files with headers):

```bash
tail -n+2 file.log
```
