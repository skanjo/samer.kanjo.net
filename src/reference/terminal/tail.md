# tail

## List last 10 lines of file
```bash
tail some.log
```

## List last 50 lines of file
```bash
tail -50 some.log
```

## List everything after top 10 lines of file
```bash
tail +10 some.log
```

## List last 10 lines of file and monitor
```bash
tail -10f some.log
```

## Ignore the first N lines of a file
This is useful when processing file with a header in which case N=2
```bash
tail -n+N FILE
```
