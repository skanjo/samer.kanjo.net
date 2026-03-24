---
title: Managing SSH keys with ssh-keygen
---

## Generating keys

Generate an Ed25519 key pair (preferred):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519
```

Generate an RSA key pair with passphrase and no prompts:

```bash
ssh-keygen -t rsa -f ~/.ssh/id_rsa -N "passphrase"
```

Generate an RSA key pair with no passphrase and no prompts:

```bash
ssh-keygen -t rsa -f ~/.ssh/id_rsa -N ""
```

## Managing keys

Set or change passphrase on an existing key:

```bash
ssh-keygen -p -f ~/.ssh/id_rsa
```

## Known hosts

Remove a host from known hosts:

```bash
ssh-keygen -R hostname
```

Visualize known host key fingerprints:

```bash
ssh-keygen -lv -f ~/.ssh/known_hosts
```
