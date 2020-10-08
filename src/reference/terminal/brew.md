# brew

To list software you currently have installed with version numbers, use:
```bash
brew list --versions
```

To see just the software, which is not a dependency of another:
```bash
brew leaves
```

To keep the Homebrew itself up-to-date, and fetch the newest version from GitHub:
```bash
brew update
```

After updating the brew, check which formulae have an updated version available, display detailed version information to
see if you have more than one older version laying around:
```bash
brew outdated --verbose
```

See any app that you no longer need and want to get rid of them? Check the dependencies for all installed formulae:
```bash
brew deps --installed
```

For even more detailed picture, show the dependencies for all installed formulae as a tree:
```bash
brew deps --installed --tree
```

As a final precaution before removing a formula, see what other installed formulae use it as a dependency:
```bash
brew uses --installed formula
```

Uninstall formulae and all their older versions:
```bash
brew remove --force formulae
```

Upgrade remaining formulae:
```bash
brew upgrade
```

Show what will be removed by cleanup command, but do not actually remove anything:
```bash
brew cleanup -ns
```

Clean the "Cellar" removing any older versions of installed formulae and clearing old downloads from the Homebrew
download-cache. Additionally, scrub the cache, removing downloads for even the latest versions of formula, which are downloaded, but not installed:

```bash
brew cleanup -s
```

```bash
brew info [formula]
```
