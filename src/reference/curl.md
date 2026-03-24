---
title: Transferring data with curl
---

## Downloading

Download to stdout:

```bash
curl http://www.example.com
```

Save to a specified file:

```bash
curl -o my_file http://www.example.com
```

Save using the file name from the URL:

```bash
curl -O http://www.example.com/index.html
```

Download multiple files:

```bash
curl -O http://www.example.com/this.html -O http://www.example.com/that.html
```

Resume an interrupted download:

```bash
curl -C - http://www.example.com
```

Follow redirects:

```bash
curl -L http://www.example.com
```

Fetch only if modified after a date:

```bash
curl -z 21-Dec-17 http://www.example.com
```

Fetch only if modified before a date:

```bash
curl -z -21-Dec-17 http://www.example.com
```

## HTTP requests

GET (default):

```bash
curl http://www.example.com
```

POST:

```bash
curl -X POST http://www.example.com
```

POST with form-encoded parameters in the body:

```bash
curl -X POST -d "p1=v1&p2=v2" http://www.example.com
```

POST with JSON body:

```bash
curl -X POST -d '{"name":"value"}' http://www.example.com
```

POST with a file as the body:

```bash
curl -X POST -d @file.json http://www.example.com
```

POST multipart form data:

```bash
curl -X POST -F foo=bar -F bar=baz http://www.example.com
```

POST multipart form with file upload:

```bash
curl -X POST -F foo=bar -F bar=@file.png http://www.example.com
```

## Headers and auth

Set request headers:

```bash
curl --header "Content-Type: application/json" http://www.example.com
```

Basic auth:

```bash
curl -u username:password http://www.example.com
```

## Cookies

Send cookies from a file:

```bash
curl -b cookie_file http://www.example.com
```

Send a cookie value directly:

```bash
curl -b "name=value" http://www.example.com
```

Save response cookies to a file:

```bash
curl -c cookie_file http://www.example.com
```

## Debugging

Verbose output (protocol details):

```bash
curl -v http://www.example.com
```

Full data transfer trace:

```bash
curl --trace output.txt http://www.example.com
```
