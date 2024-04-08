---
layout: layouts/base.liquid
title: hdfs
---

# hdfs


Run filesystem commands
```bash
hdfs dfs COMMAND
```

Show command usage
```bash
hdfs dfs
```

List contents of directory
```bash
hdfs dfs -ls /some/path/to/list
```

Cat a file
```bash
hdfs dfs -cat /path/to/file
```

Add file to HDFS. Use -f to force overwrite
```bash
hdfs dfs -put /some/file.ext /path/in/hdfs/for/file
```

Add folder and its contents to HDFS
```bash
hdfs dfs -put /linux/path /hdfs/path
```

Get a file
```bash
hdfs dfs -get /some/path/in/hdfs /path/to/place/file
```

Remove a file. Use -r for recursive delete
```bash
hdfs dfs -rm /some/path/in/hdfs
```

Make directory. Use -p to create entire path.
```bash
hdfs dfs -mkdir /path/to/new/directory
```

Remove directory.
```bash
hdfs dfs -rmdir /path/to/new/directory
```

Remove directory with content
```bash
hdfs dfs -rm -r /path/to/new/directory
```

Leave safe mode, this was necessary when trying to restart HDFS after config change but it failed to leave safe mode and
start, need to run as privileged user hdfs
```bash
sudo -u hdfs hdfs dfsadmin -safemode leave
```

**Check HDFS file consistency**, need to run as privilged user hdfs, find corrupt, missing, and under replicated blocks
```bash
sudo -u hdfs hdfs fsck /
```

**List HDI storage account from HDP master**
```bash
hdfs dfs -ls wasb://this@that.blob.core.windows.net/
```

**List cold storage account from HDP master**
```bash
hdfs dfs -ls wasb://this@that.blob.core.windows.net/
```

**Create folder on cold storage account**
```bash
hdfs dfs -mkdir -p wasb://this@that.blob.core.windows.net/tmp/test
```

**Create folder on local HDFS**
```bash
hdfs dfs -mkdir /tmp/test
```
