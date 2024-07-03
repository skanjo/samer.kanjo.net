---
title: 'gzip: Cheat Sheet'
publicationDate: '2020-10-07'
tags: 'Cheat Sheet'
---

## Compress
Zip all files and all files in sub-directories of the specified starting path.
```bash
gzip -r .
```

Zip all JSON files in current directory and all sub-directories. If file names contain spaces then will need to quote the arg passed to gzip.
```bash
find . -type f -name '*.json' -exec gzip {} \;
```

## Decompess
Unzip all files and all files in sub-directories of the specified starting path.
```bash
gunzip -r .
```

Unzip a set of files matching a pattern in directory and keep the original files (-k)
```bash
for a in `ls *.log.gz`; do gunzip -k $a; done
```
