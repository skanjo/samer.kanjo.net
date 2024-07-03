---
title: 'jq: Cheat Sheet'
publicationDate: '2020-04-19'
lastUpdated: '2023-03-17'
tags: 'Cheat Sheet'
---

## General Usage

### Pretty Print
Reformat the content of a file to include uniform indentation and new lines to make the JSON content easier to read. The
`.` is the identity filter which produces the input as output and unchanged. By default `jq` pretty prints output so
this is a convenient way to pretty print ant content.

Assume the following is the ugly content of the file `example.json`:

```json
{"name": "John","age": 30,"city": "New York","pets": [{"name": "Fido","species": "Dog","age": 5},{"name": "Whiskers","species": "Cat","age": 3}]}
```

This command will pretty print the content of the file:

```bash
jq . example.json
```

This is the output:

```json
{
  "name": "John",
  "age": 30,
  "city": "New York",
  "pets": [
    {
      "name": "Fido",
      "species": "Dog",
      "age": 5
    },
    {
      "name": "Whiskers",
      "species": "Cat",
      "age": 3
    }
  ]
}
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
Reformat the content of a file to remove indentations and newlines.

Assume the following is the content of the file `example.json`:

```json
{
  "name": "John",
  "age": 30,
  "city": "New York",
  "pets": [
    {
      "name": "Fido",
      "species": "Dog",
      "age": 5
    },
    {
      "name": "Whiskers",
      "species": "Cat",
      "age": 3
    }
  ]
}
```

This command will minify the content of the file:

```bash
jq -c . example.json
```

This is the output:

```json
{"name":"John","age":30,"city":"New York","pets":[{"name":"Fido","species":"Dog","age":5},{"name":"Whiskers","species":"Cat","age":3}]}
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
This query takes a JSON file containing Datadog monitor data, and extracts a subset of the fields for each monitor,
including the `id`, `name`, `query`, `message`, `created`, `creator`, `modified`, and `type` fields. The `[]` operator
selects each object in the array, and the `{}` operator creates a new object with the desired fields.

```bash
jq '[.[] | {
  id: .id,
  name: .name,
  query: .query,
  message: .message,
  created: .created,
  creator: .creator.email,
  modified: .modified,
  type: .type
}]' datadog_monitors.json

```

### Extract the recipients from DataDog monitor TSV:
```bash
cut -f 4 datadog_monitors.txt | grep '@' | sed -e 's/[^@]*//' | sort | uniq
```

## AWS
### Query Database Instances
Get basic instance information and filtering by security group. The file `rds_instances.json` was created by running
this command:

```bash
aws rds describe-db-instances
````

This query filters a JSON file containing AWS RDS instance data to select only those instances that have a specific VPC
security group. For each selected instance, it extracts a subset of the fields, including the `DBInstanceIdentifier`,
`Engine`, `Endpoint.Address`, `Endpoint.Port`, and `VpcSecurityGroups[].VpcSecurityGroupId` fields.

```bash
jq '[.DBInstances[] |
     select(.VpcSecurityGroups[].VpcSecurityGroupId == "sg-731b5d16") |
     {
       db_id: .DBInstanceIdentifier,
       engine: .Engine,
       ep_addr: .Endpoint.Address,
       ep_port: .Endpoint.Port,
       sec_grps: [.VpcSecurityGroups[].VpcSecurityGroupId]
     }
   ]' rds_instances.json

```

The same above but output as CSV rather than JSON:

```bash
jq -r '.DBInstances[] |
       select(.VpcSecurityGroups[].VpcSecurityGroupId == "sg-731b5d16") |
       [.DBInstanceIdentifier, .Engine, .Endpoint.Address, .Endpoint.Port] |
       @csv' rds_instances.json
```

And finally doing it all in one command:
```bash
aws rds describe-db-instances | \
jq -r '.DBInstances[] |
       select(.VpcSecurityGroups[].VpcSecurityGroupId == "sg-731b5d16") |
       [.DBInstanceIdentifier, .Engine, .Endpoint.Address, .Endpoint.Port] |
       @csv'
```

### Query Route 53

The following is an example Route 53 JSON response from an AWS CLI request to get all records for a hosted zone. The
example file will be referred to as `route53.json` and was generated using a command like:

```bash
aws route53 list-resource-record-sets --hosted-zone-id ABC123 > route53.json
````

This is example output:

```json
{
    "ResourceRecordSets": [
        {
            "Name": "example.com.",
            "Type": "A",
            "TTL": 300,
            "ResourceRecords": [
                {
                    "Value": "10.0.0.1"
                },
                {
                    "Value": "10.0.0.2"
                }
            ]
        },
        {
            "Name": "www.example.com.",
            "Type": "CNAME",
            "TTL": 300,
            "ResourceRecords": [
                {
                    "Value": "example.com"
                }
            ]
        },
        {
            "Name": "alias.example.com.",
            "Type": "A",
            "AliasTarget": {
                "HostedZoneId": "Z2FDTNDATAQYW2",
                "DNSName": "d1234.cloudfront.net",
                "EvaluateTargetHealth": false
            }
        },
        {
            "Name": "example.com.",
            "Type": "NS",
            "TTL": 172800,
            "ResourceRecords": [
                {
                    "Value": "ns-1234.awsdns-12.org."
                },
                {
                    "Value": "ns-5678.awsdns-56.co.uk."
                }
            ]
        },
        {
            "Name": "example.com.",
            "Type": "SOA",
            "TTL": 900,
            "ResourceRecords": [
                {
                    "Value": "ns-1234.awsdns-12.org. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"
                }
            ]
        },
        {
            "Name": "mail.example.com.",
            "Type": "MX",
            "TTL": 300,
            "ResourceRecords": [
                {
                    "Value": "10 mail.example.com."
                },
                {
                    "Value": "20 alt1.mail.example.com."
                },
                {
                    "Value": "30 alt2.mail.example.com."
                }
            ]
        },
        {
            "Name": "example.com.",
            "Type": "TXT",
            "TTL": 300,
            "ResourceRecords": [
                {
                    "Value": "\"v=spf1 include:_spf.google.com ~all\""
                }
            ]
        }
    ]
}
```

The following query takes the Route 53 example JSON file, selects all the `ResourceRecordSet` objects in the file,
filters out records of type `NS` and `SOA`, and extracts the `Name`, `Type`, and `Value` fields of each record. If the
record has multiple `Value` fields, they are concatenated into a single comma-separated string. The resulting output is
formatted as a TSV string.

```bash
jq -r '.ResourceRecordSets[] |
       select(.Type != "NS" and .Type != "SOA") |
       [.Name, .Type,
        if .ResourceRecords
          then (.ResourceRecords | map(.Value) | join(","))
          else .AliasTarget.DNSName
        end] |
        @tsv' route53.json
```

This is the output:

```txt
example.com.	A	10.0.0.1,10.0.0.2
www.example.com.	CNAME	example.com
alias.example.com.	A	d1234.cloudfront.net
mail.example.com.	MX	10 mail.example.com.,20 alt1.mail.example.com.,30 alt2.mail.example.com.
example.com.	TXT	"v=spf1 include:_spf.google.com ~all"
```

Here's what the query is doing, step by step:

1. `.ResourceRecordSets[]` - This part of the query selects all the `ResourceRecordSets` objects in the JSON file and iterates over them.
2. `select(.Type != "NS" and .Type != "SOA")` - This part of the query filters out records of type `NS` and `SOA` from the output. The `select()` function takes a boolean expression as its argument, and returns only the elements of the array that evaluate to `true`. In this case, the expression `(.Type != "NS" and .Type != "SOA")` evaluates to `true` for all records that are not of type `NS` or `SOA`.
3. `[.Name, .Type, if .ResourceRecords then (.ResourceRecords | map(.Value) | join(",")) else .AliasTarget.DNSName end]` - This part of the query creates an array that includes the `Name`, `Type`, and `Value` fields of each `ResourceRecordSet` object. If the record has `ResourceRecords`, the query maps the `Value` field of each `ResourceRecord` object to an array of strings, and then joins them into a comma-separated string using the `join()` function. If the record has an `AliasTarget`, the query extracts the `DNSName` field under the `AliasTarget` object. The resulting array contains the `Name`, `Type`, and `Value` fields of the record.
4. `@tsv` - This part of the query formats the output as a tab-separated value (TSV) string. The fields in the array created in step 3 are separated by tabs rather than commas.
5. `-r` - This option tells jq to output the result as raw text rather than JSON.
