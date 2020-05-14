---
layout: terminal-command
title: jq
tags: terminal-command
---

## General Usage
### Pretty print JSON document from root
```bash
jq . < some.json
```

### Extract property
```bash
jq .the.dot.path.to.property < some.json
```

### Extract property without quotes
```bash
jq -r .the.path < some.json
```

### Minify
```bash
jq -c . < some.json
```

### Get first element in array
```bash
jq .[0] some.json
```

### Get properties from objects in array
```bash
jq '.[] | {.id, .name}' some.json
```

### DataDog, get interesting properties from export as array:
```bash
jq '[.[] | {id: .id, name: .name, query: .query, message: .message, created: .created, creator: .creator.email, modified: .modified, type: .type}]' datadog_monitors.json
```

### Extract the recipients from DataDog monitor TSV:
```bash
cut -f 4 datadog_monitors.txt | grep '@' | sed -e 's/[^@]*//' | sort | uniq
```

## AWS
### Query Database Instances
Get basic instance information and filtering by security group. The file `rds_instances.json` was created by running `aws rds describe-db-instances`.

```bash
jq '[.DBInstances[] | select(.VpcSecurityGroups[].VpcSecurityGroupId=="sg-731b5d16") | {db_id: .DBInstanceIdentifier, engine: .Engine, ep_addr: .Endpoint.Address, ep_port: .Endpoint.Port, sec_grps: [.VpcSecurityGroups[].VpcSecurityGroupId]}]' rds_instances.json
```

The same above but output is CSV rather than JSON
```bash
jq -r '.DBInstances[] | select(.VpcSecurityGroups[].VpcSecurityGroupId=="sg-731b5d16") | [.DBInstanceIdentifier, .Engine, .Endpoint.Address, .Endpoint.Port] | @csv' rds_instances.json
```

And finally doing it all in one command:
```bash
aws rds describe-db-instances | jq -r '.DBInstances[] | select(.VpcSecurityGroups[].VpcSecurityGroupId=="sg-731b5d16") | [.DBInstanceIdentifier, .Engine, .Endpoint.Address, .Endpoint.Port] | @csv'
```
