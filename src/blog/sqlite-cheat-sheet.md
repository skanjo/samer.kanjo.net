---
title: 'sqlite: Cheat Sheet'
publicationDate: '2020-10-07'
tags: 'Cheat Sheet'
---

To start shell
```bash
sqlite3
```

To create database and enter shell
```bash
sqlite3 dbname
```

List tables
```bash
.tables
```

To run select from table
```bash
select * from some_table;
```

Delete from table
```bash
delete from some_table;
```

Import data from file into table with default separator ','
```bash
.import /path/to/file table_name
```

To change separator
```bash
.separator "\t"
```

Create table
```bash
create table table_name (id int primary key, name varchar(256));
```
