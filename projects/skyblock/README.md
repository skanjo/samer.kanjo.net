# Hypixel Skyblock Scripts

Some scripts to help playing Skyblock.

## Parse Souls

The Fandom Hypixel Skyblock wiki is the only source for mob souls that can be summoned including their stats and
summoning cost. The `souls_data.json` file was pulled from the web site API that was observed in the browser. The script
`parse_souls.js` parse this file to produce a CSV file that can be used as a better reference than the Fandom wiki. Run
the script using the following command. The script assumes at least NodeJS 20+.

```shell
node parse_souls.js
```
