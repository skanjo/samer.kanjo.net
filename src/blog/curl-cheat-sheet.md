---
title: 'curl: Cheat Sheet'
publicationDate: '2020-04-18'
tags: 'Cheat Sheet'
---

Learn essential commands for transferring data with URLs, making HTTP requests, and downloading files with this quick
reference guide. Perfect for developers and system administrators!

---

Curl is a command-line tool for transferring data with URLs. It supports various protocols and is commonly used for HTTP
requests and file transfers.

## Download to STDOUT

```bash
curl http://www.example.com
```

## Save response to file

Save to specified file name:

```bash
curl -o my_file http://www.example.com
```

Save to file name from URL

```bash
curl -O http://www.example.com/index.html
```

## Fetch multiple files

```bash
curl -O http://www.example.com/this.html -O http://www.example.com/that.html
```

## Continue/Resume download

After interruption of a download, resume using where '-' in '-C -' indicates resume at offset that was already
downloaded. Otherwise an offset value can be provided.

```bash
curl -C - http://www.example.com
```

## Follow redirects

```bash
curl -L http://www.example.com
```

## Limit rate of transfer

In this example limit rate of transfer to 1000B per second

```bash
curl --limit-rate 1000B -O http://www.example.com/bigfile.html
```

## Fetch if modified before/after time

Works for FTP and HTTP

Fetch if modified after 12/21/2017

```bash
curl -z 21-Dec-17 http://www.example.com
```

Fetch if modified before 12/21/2017

```bash
curl -z -21-Dec-17 http://www.example.com
```

## HTTP Auth

```bash
curl -u username:password http://www.example.com
```

## FTP Auth

```bash
curl -u username:password -O ftp://www.example.com/index.html
```

## Upload to FTP

Upload one file

```bash
curl -u user:pass -T file.txt ftp://www.exmaple.com
```

Upload multiple files

```bash
curl -u user:pass -T "{file1.txt,file2.txt}" ftp://www.exmaple.com
```

Upload from STDIN

```bash
curl -u user:pass -T - ftp://www.exmaple.com/file.txt
```

## Verbose/Trace

Print protocol details

```bash
curl -v http://www.example.com
```

Dump data transfer

```bash
curl --trace http://www.exmaple.com
```

## Send Mail

```bash
curl --mail-from you@here.com --mail-rcpt them@there.com smtp://example.com
```

## Send cookies

Send from file

```bash
curl -b cookie_file http://www.example.com
```

Send value where name=value is a valid cookie string

```bash
curl -b "name=value" http://www.example.com
```

Send multiple cookies

```bash
curl -b "name1=value1; name2=value2" http://www.example.com
```

Skip session cookies

```bash
curl -b cookie_file -j http://www.example.com
```

## Save Cookies

```bash
curl -c cookie_file http://www.example.com
```

## Request Header

```bash
curl --header "HEADER1" --header "HEADER" http://www.example.com
```

## HTTP Method

Default method is GET but can specify POST, PATCH, PUT, and DELETE. Wonder what else is supported

Post

```bash
curl -X POST http://www.example.com
```

Post with parameters

```bash
curl -X POST http://www.example.com?p1=v1&p2=v2
```

Post with parameters in request body

```bash
curl -X POST -d "p1=v1&p2=v2" http://www.example.com
```

Post with JSON in request body

```bash
curl -X POST -d "{'name':'value'}" http://www.example.com
```

Post with file in request body

```bash
curl -X POST -d @file.json http://www.example.com
```

Post form parameters

```bash
curl -X POST -F foo=bar -F bar=baz http://www.example.com
```

Post form parameters with upload

```bash
curl -X POST -F foo=bar -F bar=@file.png http://www.example.com
```

## Cookie File Format

Tab delimited set of cookies, one per line with the following values:

* domain - domain that created and read the variable
* flag - TRUE/FALSE value indicating if machine with domain can read the variable, usually set by browser based on value
  set for domain
* path - The path within the domain variable is valid for
* secure - TRUE/FALSE value indicating if secure connection is required to access variable
* expiration - Unix time variable will expire, which is number of seconds since Jan 1, 1970 00:00:00 GMT
* name - name of variable
* value - value of variable
