---
title: Encrypting and signing with GPG
---

## Reference

### Key listing terms

```txt
sec => 'SECret key'
ssb => 'Secret SuBkey'
pub => 'PUBlic key'
sub => 'public SUBkey'
```

A `sec#` in the listing means only the secret subkeys are available — the primary secret key has been removed, which
prevents creating new subkeys but protects the primary key. Always back up the primary secret key before removing it.

### Key usage types

```txt
Constant           Character      Explanation
─────────────────────────────────────────────────────
PUBKEY_USAGE_SIG      S       key is good for signing
PUBKEY_USAGE_CERT     C       key is good for certifying other signatures
PUBKEY_USAGE_ENC      E       key is good for encryption
PUBKEY_USAGE_AUTH     A       key is good for authentication
```

## Creating keys

Generate an RSA 4096-bit key pair (GPG 2.1.17+):

```bash
gpg --full-generate-key
```

On older versions:

```bash
gpg --default-new-key-algo rsa4096 --gen-key
```

## Listing keys

List public keys:

```bash
gpg --list-keys
```

List with long (16-character) key IDs:

```bash
gpg --list-keys --keyid-format long
```

Include expired subkeys (hidden by default):

```bash
gpg --list-keys --keyid-format long --list-options show-unusable-subkeys
```

List secret keys (`#` next to `sec` or `ssb` means the key is not usable):

```bash
gpg --list-secret-keys
```

Include expired secret subkeys:

```bash
gpg --list-secret-keys --list-options show-unusable-subkeys
```

Show fingerprints (use `--fingerprint` twice to include subkeys):

```bash
gpg --fingerprint --fingerprint
```

## Exporting keys

Export public key:

```bash
gpg --output ${KEYID}-public.asc --export --armor ${KEYID}
```

Full backup — primary key, subkeys, public and secret parts:

```bash
gpg --output ${KEYID}-private.asc --export-secret-keys --armor ${KEYID}
```

Partial backup — subkeys only, for use as an everyday keyring:

```bash
gpg --output ${KEYID}-subkeys.asc --export-secret-subkeys --armor ${KEYID}
```

## Importing keys

```bash
gpg --import public.asc
gpg --import private.asc
gpg --import subkeys.asc
```

## Trusting keys

After importing, keys default to unknown trust. Edit the key and set the trust level:

```bash
gpg --edit-key ${KEYID}
gpg> trust
gpg> quit
```

## Decrypting files

Decrypt a single file (outputs to the same filename without the `.gpg` extension):

```bash
gpg file.gpg
```

Decrypt multiple files with a single passphrase prompt:

```bash
gpg --decrypt-files *.gpg
```

Decrypt multiple files found recursively (prompts for passphrase per file):

```bash
find /some/path -type f -iname '*.gpg' -execdir gpg {} \;
```

## Deleting keys

Delete public key (fails if the private key still exists):

```bash
gpg --delete-keys [keyid]
```

Delete private key:

```bash
gpg --delete-secret-keys [keyid]
```

Delete both public and private keys:

```bash
gpg --delete-secret-and-public-keys [keyid]
```

## Updating key expiration

Edit the key to enter the GPG shell:

```bash
gpg --edit-key ${KEYID}
```

Set expiration on the primary key:

```bash
gpg> expire
Key is valid for? (0) 1y
```

Select all subkeys and set their expiration:

```bash
gpg> key 1
gpg> key 2
gpg> expire
Are you sure you want to change the expiration time for multiple subkeys? (y/N) y
Key is valid for? (0) 1y
```

Review and save:

```bash
gpg> save
```

Verify the new expiration dates:

```bash
gpg --list-secret-keys
```

After updating expiration, you need to trust the keys again, back them up, delete all keys, then re-import only the
subkeys (not the primary key). See the exporting and importing sections above.
