# ssh-keygen

Generate RSA key pair, with passphrase and no prompts
```bash
ssh-keygen -t rsa -f ~/.ssh/id_rsa -N "passphrase"
```

Generate RSA key pair, with no passphrase and no prompts
```bash
ssh-keygen -t rsa -f ~/.ssh/id_rsa -N ""
```

Remove host from list of known hosts
```bash
ssh-keygen -R hostname
```

Set new passphrase on existing key
```bash
ssh-keygen -p -f ~/.ssh/id_rsa
```

Visualize known host keys
```bash
ssh-keygen -lv -f ~/.ssh/known_hosts
```
