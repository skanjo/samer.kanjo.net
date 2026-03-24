---
title: Querying databases with SQLite
---

## Shell

Start the interactive shell:

```bash
sqlite3
```

Open or create a database:

```bash
sqlite3 dbname
```

## Dot-commands

List tables:

```bash
.tables
```

Change output separator (e.g. for tab-delimited):

```bash
.separator "\t"
```

Import data from a file into a table (default separator is `,`):

```bash
.import /path/to/file table_name
```
