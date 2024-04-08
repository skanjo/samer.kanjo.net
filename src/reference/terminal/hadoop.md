---
layout: layouts/base.liquid
title: hadoop
---

# hadoop

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
