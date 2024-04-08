---
layout: layouts/base.liquid
title: gpg
---

# gpg

## Key Listing Terms
```
sec => 'SECret key'
ssb => 'Secret SuBkey'
pub => 'PUBlic key'
sub => 'public SUBkey'
```

## Secret Key
The key listing uses `sec` to identify a secret key. When the listing contains `sec` only the secret key is available.
When the listing contains `sec#` then only the secret subkeys are available. When the secret subkey is only available
that means the secret key has been removed making it impossible to create new subkeys. This provides protection of your
secret key. Make sure to backup your secret key.

### Key Type
```
Constant           Character      Explanation
─────────────────────────────────────────────────────
PUBKEY_USAGE_SIG      S       key is good for signing
PUBKEY_USAGE_CERT     C       key is good for certifying other signatures
PUBKEY_USAGE_ENC      E       key is good for encryption
PUBKEY_USAGE_AUTH     A       key is good for authentication
```

## Create Key Pair
If using GPG 2.1.17 or later the following will generate RSA with 4096 bits.
```bash
gpg --full-generate-key
```

If using prior version the following will do the same
```bash
gpg --default-new-key-algo rsa4096 --gen-key
```

## Export Keys
Export public key
```bash
gpg --output ${KEYID}-public.asc --export --armor ${KEYID}
```

Create full backup of keyring including primary, subkeys, public, and secret parts.
```bash
gpg --output ${KEYID}-private.asc --export-secret-keys --armor ${KEYID}
```

Create partial backup without secret part of primary key. Can be used as everyday key ring.
```bash
gpg --output ${KEYID}-subkeys.asc --export-secret-subkeys --armor ${KEYID}
```

## Import Keys
And import on another machine
```bash
gpg --import public.asc
gpg --import private.asc
gpg --import subkeys.asc
```

## Trust Keys
Edit the key to start gpg shell.
```bash
gpg --edit-key {KEY}
```

Enter the trust command and then select the trust level for the key and hit enter.
```bash
gpg> trust
Please decide how far you trust this user to correctly verify other users' keys
(by looking at passports, checking fingerprints from different sources, etc.)

  1 = I don't know or won't say
  2 = I do NOT trust
  3 = I trust marginally
  4 = I trust fully
  5 = I trust ultimately
  m = back to the main menu

Your decision? 5

Quit to exit the shell back to the command prompt:
gpg> quit
```

## List keys in public keyring
```bash
gpg --list-keys
```

Use long form to see subkey IDs with 16 charters key ID. Use short for 8 character key ID. The short version is the last
8 characters of the long.
```bash
gpg --list-keys --keyid-format long
```

List subkeys that have expired. By default expired subkeys are not listed.
```bash
gpg --list-keys --keyid-format long --list-options show-unusable-subkeys
```

List all secret keys. an `#` next to sec or ssb indicates the secret key or subkey is not usable.
```bash
gpg --list-secret-keys
```

List subkeys that have expired. By default expired subkeys are not listed.
```bash
gpg --list-secret-keys --list-options show-unusable-subkeys
```

Show fingerprints for all keys using the command twice. Can also use with keyid format. This command is very similar to
list-keys and pretty prints the keyid.
```bash
gpg --fingerprint --fingerprint
```

## Decrypt files
Import public private key pair of public key used to encrypt files
```bash
gpg --import keys.asc
```

Decrypt single file. This will output decryption to same filename with gpg extension removed. Will also prompt for
passphrase
```bash
gpg file.gpg
```

Decrypt multiple files. This will prompt for passphrase for every file.
```bash
find /some/path -type f -iname '*.gpg' -execdir gpg {} \;
```

OMG, to decrypt multiple files in directory. You will be asked for passphrase once.
```bash
gpg --decrypt-files *.gpg
```

List keys for which there are public and private keys.
```bash
gpg --list-secret-keys --keyid-format LONG
```

## Delete Keys
Delete public keys. If the private key for the public key being deleted exists this command will fail.
```bash
gpg --delete-keys keyid
```

Delete private keys.
```bash
gpg --delete-secret-keys keyid
```

Delete both public and private keys
```bash
gpg --delete-secret-and-public-keys keyid
```

## Edit Trust
When importing a key the trust level will be set to unknown. To change the trust edit the key and use the trust command
to set new level.
```bash
gpg --edit-key ${KEYID}
gpg> trust
gpg> ...do the thing on the screen...
gpg> quit
```

## Update Key Expiration
Given the secret key and two subkeys on for encryption and one for signing, follow these steps to update expiration date
for all keys.

Get the secret key ID:
```bash
gpg --list-secret-keys
```

Edit the key to set new expiration date. This will start a shell to manage the keys and list the selected key and
subkeys.
```bash
gpg --edit-key KEYID
```

Set the expiration of the primary key (key 0):
```bash
gpg> expire
hanging expiration time for the primary key.
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 1y


To update al the subkeys select each subkey and then run expire command again:
gpg> key 1
gpg> key 2
gpg> expire
Are you sure you want to change the expiration time for multiple subkeys? (y/N) y
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 1y

Now review the expiration date for primary key and subkeys to verify expiration
dates for all keys. if all is well then save the changes.
gpg> save
```

The save command will exit the shell back to the command prompt. List the keysto verify the expiration dates:

```bash
gpg --list-secret-keys
```

Since the keys have modified you will need to trust the keys again. Now that the keys have been updated they need to be
backed up again and then all keys deleted. After deletion import only the subkeys and not the primary key. See export
section above to export keys for backup.
