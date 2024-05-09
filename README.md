# samer.kanjo.net site

## Fonts

This web site is using several custom fonts including:

- [Inter](https://github.com/rsms/inter)
- [Roboto Serif](https://github.com/googlefonts/roboto-serif)
- [Roboto Mono](https://github.com/googlefonts/RobotoMono)
- [Font Awesome](https://github.com/FortAwesome/Font-Awesome)

Originally I was referencing these fonts as NPM packages from [Fontsource](https://github.com/fontsource)
and [Fortawsome](https://github.com/FortAwesome), and using 11ty to select the necessary files from package source and
copying to my build directory. However, I decided to include the fonts directly in the site as static assets to avoid
having to download them on every build.

For Inter and Roboto fonts, I am using [font-files](https://github.com/fontsource/font-files) from Fontsource to select
the font files and CSS I would like to use on this site. For Font Awesome, I am
using [Font Awesome Free](https://github.com/FortAwesome/Font-Awesome/tree/6.x/js-packages/%40fortawesome/fontawesome-free)
to select the font files and CSS I would like to use on this site.

All licenses for the fonts are included in source.

