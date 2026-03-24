---
title: Processing JSON with jq
---

## Formatting

Pretty print:

```bash
jq . file.json
```

Minify:

```bash
jq -c . file.json
```

## Extracting values

Extract a property by dot path:

```bash
jq .the.dot.path.to.property file.json
```

Extract as raw text (no quotes):

```bash
jq -r .the.path file.json
```

## Arrays

Get the first element:

```bash
jq '.[0]' file.json
```

Get specific properties from each object in an array:

```bash
jq '.[] | {id, name}' file.json
```

Wrap the results back into an array:

```bash
jq '[.[] | {id, name}]' file.json
```

## Filtering

Select objects matching a condition:

```bash
jq '.[] | select(.status == "active")' file.json
```

Exclude by condition:

```bash
jq '.[] | select(.type != "NS" and .type != "SOA")' file.json
```

## Nested extraction

Extract a nested field and reshape:

```bash
jq '[.items[] | {
  id: .id,
  name: .name,
  email: .creator.email
}]' file.json
```

## Combining values

Join array values into a string:

```bash
jq '.values | map(.name) | join(",")' file.json
```

Conditionally extract from different shapes:

```bash
jq '.[] | if .records then (.records | map(.value) | join(",")) else .alias end' file.json
```

## Output formats

Output as CSV:

```bash
jq -r '.[] | [.id, .name, .status] | @csv' file.json
```

Output as TSV:

```bash
jq -r '.[] | [.id, .name, .status] | @tsv' file.json
```

## Piping from other commands

Process output from another command directly:

```bash
some-command | jq -r '.items[] | [.id, .name] | @csv'
```
