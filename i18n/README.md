# Landing page translations

`apps/egm-downloader.html` is the English source. Each translated copy is generated from it and lives at `apps/<code>/egm-downloader.html`. Do not edit the generated copies.

- `i18n/<code>.json`: the translations, as `"English text": "Translated text"` pairs.
- `i18n/keep.txt`: names and terms that are never translated.
- `i18n/build.py`: builds every language that has a strings file. It stops if any English text has no translation.

## Build

    python3 i18n/build.py          # build all languages
    python3 i18n/build.py --list   # every English string that needs a translation

## Add a language

1. Create `i18n/<code>.json` (copy `es.json`) and translate every string. Keep `{0}` placeholders and the arrows as they are. `python3 i18n/build.py --list` prints the English strings.
2. In `apps/egm-downloader.html` add the language to the `hreflang` links in the head and to the language menu (`id="langSel"`).
3. Add the menu code (for example `DE`) to `i18n/keep.txt`, and the page locale to `LOCALES` in `i18n/build.py` (for example `'de': 'de_DE'`).
4. Run the build, then add the new page to `sitemap.xml`.
5. Check the page at phone and tablet widths (320 to 1440). Longer languages need a look at the header between 981 and 1100px, and at the headline on a 320px phone. Language specific CSS lives at the end of `apps/egm-downloader.css`.
6. Bump the `?v=` number on the CSS and JS links only if `egm-downloader.css` or `.js` changed.

The latest version chip and the GitHub star count on the landing page are filled in by `apps/egm-downloader.js` (from `apps/egm-version.json` and `apps/stars.php`). They are only numbers, so there is nothing to translate. If a label is ever added next to them, it becomes a new string for every language.

Right to left languages (Arabic): also add the code to `RTL` in `i18n/build.py`, which puts `dir="rtl"` on the page. The page mirrors by itself, the sample app windows stay left to right like the app, and the Arabic block at the end of the CSS handles the rest. Wrap file extensions and @handles inside Arabic text in the invisible isolates U+2066 and U+2069 (see `ar.json`), or they show in the wrong order.

## Changing the English copy

Edit the English page, add or update the matching entry in each `i18n/<code>.json`, then run the build. Commit the source, the strings files and the generated pages together.
