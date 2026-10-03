# Landing page translations

`apps/egm-downloader.html` is the English source. Each translated copy is generated from it and lives at `apps/<code>/egm-downloader.html`. Do not edit the generated copies.

- `i18n/<code>.json`: the translations, as `"English text": "Translated text"` pairs.
- `i18n/keep.txt`: names and terms that are never translated.
- `i18n/build.py`: builds every language that has a strings file. It stops if any English text has no translation.

## Build

    python3 i18n/build.py          # build all languages
    python3 i18n/build.py --list   # every English string that needs a translation

## Add a language

1. Create `i18n/<code>.json` (copy `es.json`) and translate every string. Keep `{0}` placeholders and the arrows as they are.
2. In `apps/egm-downloader.html` add the language to the `hreflang` links in the head and to the language menu (`id="langSel"`).
3. Run the build, then add the new page to `sitemap.xml`.
4. Bump the `?v=` number on the CSS and JS links only if `egm-downloader.css` or `.js` changed.

## Changing the English copy

Edit the English page, add or update the matching entry in each `i18n/<code>.json`, then run the build. Commit the source, the strings files and the generated pages together.
