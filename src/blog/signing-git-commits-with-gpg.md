---
title: Signing Git commits with GPG
publicationDate: '2020-10-07'
tags: 'Security'
---

How I set up GPG to sign Git commits for GitHub, from key generation through to the everyday workflow with subkeys.

---

I wanted to sign my Git commits so they show up as verified on GitHub. GPG was the standard way to do this at the time.
It turned out to be more involved than expected — generating keys, managing subkeys, configuring Git, and dealing with
expiration renewals. I've since switched to SSH signing which is far simpler, but this walkthrough captures the full GPG
process in case I ever need it again.

## Generating a key pair

GPG 2.1.17+ generates RSA 4096-bit keys by default:

```bash
gpg --full-generate-key
```

This creates a primary key (for certification and signing) and may create an encryption subkey. The primary key is the
one you want to protect — it's your identity.

## Understanding the key listing

After generating, list your keys:

```bash
gpg --list-secret-keys --keyid-format long
```

The output shows abbreviations that aren't obvious at first:

- `sec` — your secret (primary) key
- `ssb` — secret subkey
- `sec#` — the primary secret key has been removed (only subkeys remain)
- `S`, `C`, `E`, `A` — signing, certification, encryption, authentication capabilities

The long key ID after the algorithm (e.g. `rsa4096/ABC123DEF456`) is what you'll use for Git config and GitHub.

## Configuring Git

Tell Git to use your signing key:

```bash
git config --global user.signingkey ${KEYID}
git config --global commit.gpgsign true
```

## Adding the key to GitHub

Export your public key and paste it into GitHub under Settings → SSH and GPG keys:

```bash
gpg --export --armor ${KEYID}
```

## Protecting the primary key with subkeys

The safest setup is to create a signing subkey, export it separately, then remove the primary secret key from your
everyday keyring. This way, if your machine is compromised, the attacker gets the subkey but not the primary key — you
can revoke the subkey and create a new one.

Export everything for backup first:

```bash
gpg --output ${KEYID}-private.asc --export-secret-keys --armor ${KEYID}
gpg --output ${KEYID}-public.asc --export --armor ${KEYID}
```

Export subkeys only:

```bash
gpg --output ${KEYID}-subkeys.asc --export-secret-subkeys --armor ${KEYID}
```

Now delete all keys and re-import only the subkeys:

```bash
gpg --delete-secret-and-public-keys ${KEYID}
gpg --import ${KEYID}-public.asc
gpg --import ${KEYID}-subkeys.asc
```

Running `gpg --list-secret-keys` should now show `sec#` — the primary key is gone from this machine. Store the full
backup somewhere safe and offline.

After importing, the trust level resets. Set it back to ultimate:

```bash
gpg --edit-key ${KEYID}
gpg> trust
Your decision? 5
gpg> quit
```

## Renewing key expiration

Keys should have an expiration date. When they're about to expire, you need the primary secret key to extend them. This
means temporarily importing the full backup.

Import the full backup:

```bash
gpg --import ${KEYID}-private.asc
```

Edit the key and set new expiration on the primary key:

```bash
gpg --edit-key ${KEYID}
gpg> expire
Key is valid for? (0) 1y
```

Then select all subkeys and update them too:

```bash
gpg> key 1
gpg> key 2
gpg> expire
Key is valid for? (0) 1y
gpg> save
```

Verify the new dates:

```bash
gpg --list-secret-keys
```

Now repeat the protection process — back up everything, delete all keys, re-import only subkeys, and set trust again.
This is the annoying part. Every renewal cycle requires this dance.

## Why I switched to SSH signing

Git 2.34+ supports signing commits with SSH keys. The setup is two commands and there's no key management ceremony:

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
```

No expiration renewals, no subkey juggling, no importing and deleting backups. GitHub supports it. If a key is
compromised, you just generate a new one and swap it out in GitHub. You can also rotate SSH keys on a regular basis
without any of the ceremony GPG requires. If you're starting fresh, use SSH signing.
