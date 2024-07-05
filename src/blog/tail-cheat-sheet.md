---
title: 'tail: Cheat Sheet'
publicationDate: '2020-04-19'
tags: 'Cheat Sheet'
---

Learn essential commands for viewing file endings, monitoring logs, and processing output streams with this quick
reference guide. Perfect for system administrators and developers!

---

Tail is a command-line utility for reading the end of files. It is commonly used to monitor log files in real-time.

## List last 10 lines of file

```bash
tail some.log
```

## List last 50 lines of file

```bash
tail -50 some.log
```

## List everything after top 10 lines of file

```bash
tail +10 some.log
```

## List last 10 lines of file and monitor

```bash
tail -10f some.log
```

## Ignore the first N lines of a file

This is useful when processing file with a header in which case N=2

```bash
tail -n+N FILE
```
