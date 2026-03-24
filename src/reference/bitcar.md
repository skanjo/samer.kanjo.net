---
title: Managing multiple Git repos with bitcar
---

[bitcar](https://github.com/machellerogden/bitcar) is a CLI tool for managing many local Git repos. It caches your
GitHub repos and lets you search, clone, and navigate between them quickly.

## Install

```bash
npm -i -g bitcar
```

## Search and navigate

Search the cache for a repo, clone it if needed, and `cd` into it:

```bash
bit SEARCH_TERM
```

## Refresh cache

Fetch repos from your GitHub account (including orgs) and update the local cache:

```bash
bit -r
```

## Clone all

Clone all repos in the cache, or only those matching a search term:

```bash
bit --clone-all SEARCH_TERM
```

## Sync existing

Add local repos not on GitHub to the cache. This is cleared on cache refresh and needs to be run again:

```bash
bit --sync-existing
```
