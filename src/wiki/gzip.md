---
title: Compressing files with gzip
---

## Compress

Compress all files recursively from the current directory:

```bash
gzip -r .
```

Compress only JSON files recursively:

```bash
find . -type f -name '*.json' -exec gzip {} \;
```

## Decompress

Decompress all files recursively:

```bash
gunzip -r .
```

Decompress matching files and keep the originals:

```bash
gunzip -k *.log.gz
```
