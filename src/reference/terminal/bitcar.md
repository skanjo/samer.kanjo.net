---
layout: layouts/base.liquid
title: bitcar
---

# bitcar

## Install
```bash
npm -i -g bitcar
```

## Search
Searches current cache for repo, clones if not already cloned, and then chage directory to repo:
```bash
bit SEARCH_TERM
```

## Refresh Cache
Reads repos available from your accout on GitHUb, including any repos from organizations and stores basic metadata about rh repo to support search, clone, and open repo in browser.
```bash
bit -r
```

## Clone All
Clone any repos found in your cache. Optionally only clone repos matching search term:
```bash
bit --clone-all SEARCH_TERM
```

## Sync Existing
Include local repos not in GitHub in the cache to support use of bitcar commands. NOTE: This config is wiped out when cache is refreshed and will need to be run again.
```bash
bit --sync-existing
```
