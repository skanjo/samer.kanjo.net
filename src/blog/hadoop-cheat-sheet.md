---
title: 'hadoop: Cheat Sheet'
publicationDate: '2020-10-07'
lastUpdated: '2024-07-05'
tags: 'Cheat Sheet'
---

Learn essential commands for distributed storage, file operations, cluster management, and data processing with this
quick reference guide. Perfect for big data engineers and analysts!

---

Hadoop is an open-source framework for distributed storage and processing of large data sets using the MapReduce
programming model. It includes components like HDFS, YARN, and MapReduce.

## hadoop

These commands used on hadoop cluster running in Azure moving files between the cluster and blob storge.

**Copy folder and its contents from HDI storage account to HDP local storage.**

```bash
hadoop distcp \
wasb://this@that.blob.core.windows.net/thing/incoming \
hdfs://hadoop-hdfs-cluster:8020//tmp/test/
```

**Copy folder and its contents from HDP local storage to cold storage account.**

```bash
hadoop distcp \
hdfs://hadoop-hdfs-cluster:8020//tmp/test/incoming \
wasb://this@that.blob.core.windows.net/tmp/test/
```

**Remove folder on cold storage account for next test**

```bash
hdfs dfs -rm -r wasb://this@that.blob.core.windows.net/tmp/test/incoming/
```

**Copy folder and its contents from HDI storage account to cold storage account on HDP master.**

```bash
hadoop distcp \
wasb://this@that.blob.core.windows.net/thing/incoming \
wasb://foo@bar.blob.core.windows.net/tmp/test/
```

## hdfs

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
