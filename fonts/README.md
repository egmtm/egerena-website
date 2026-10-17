# Fonts

The site serves its own fonts, so no request for a font leaves egerena.com (the Content Security Policy only allows `font-src 'self'`).

`fonts.css` holds every `@font-face` rule and is linked from each page as `/fonts/fonts.css?v=1`. A browser only downloads the files a page actually uses. Bump the `?v=` number on every page that links it whenever `fonts.css` or a font file changes.

## Where the files come from

The WOFF2 files are the Fontsource builds (npm) of the Google Fonts releases. Only the `latin` and `latin-ext` subsets are included, which covers every language the site ships. The `unicode-range` lines in `fonts.css` are copied from the packages.

| Family | Package | Version |
|---|---|---|
| Bricolage Grotesque (variable, weight and optical size) | `@fontsource-variable/bricolage-grotesque` | 5.3.0 |
| DM Mono (300, 400, 500) | `@fontsource/dm-mono` | 5.3.0 |
| JetBrains Mono (variable weight) | `@fontsource-variable/jetbrains-mono` | 5.3.0 |
| Outfit (variable weight) | `@fontsource-variable/outfit` | 5.3.0 |
| Cormorant Garamond (variable weight, normal and italic) | `@fontsource-variable/cormorant-garamond` | 5.3.0 |
| Share Tech Mono (400) | `@fontsource/share-tech-mono` | 5.3.0 |
| VT323 (400) | `@fontsource/vt323` | 5.3.0 |

## License

All seven families are licensed under the SIL Open Font License 1.1. Each folder keeps the license text and copyright notice that ship with the package, in `LICENSE`. Keep that file next to the font files.

## Adding or updating a font

1. `npm pack <package>` and unpack the tarball somewhere outside the repo.
2. Copy the `latin` and `latin-ext` WOFF2 files and the package `LICENSE` into a folder here.
3. Add the matching `@font-face` rules to `fonts.css` (copy the `unicode-range` from the package CSS, keep `font-display: swap`).
4. Bump `?v=` on every page that links `fonts.css`.
