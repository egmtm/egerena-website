# egerena.com — Website Source

![Version](https://img.shields.io/badge/dynamic/json?url=https://egerena.com/version.json&query=version&label=version&style=flat-square&color=0078b0)

Source code for [egerena.com](https://egerena.com), the personal portfolio and
desktop app distribution site for EGM.

This repository is auto-deployed to the live server via cPanel Git integration.

---

## What's here

- **Root** — homepage (`index.html`), site CSS/JS, error pages, contact form handler
- **`/apps/`** — desktop app product pages (Windows, macOS, Linux variants)
- **`/games/`** — games hub and STDERR (game001) game + leaderboard
- **`/team/`** — team page (dark cinematic aesthetic)

---

## What's NOT here

Files intentionally excluded from this repo (managed directly on the server):

- **`config.php`** — SMTP credentials for the contact form
- **`phpmailer/`** — third-party email library
- **`games/game001-scores.json`** — runtime leaderboard data
- **`games/game001-ratelimit.json`** — runtime rate-limit data

See [`THIRD_PARTY.md`](./THIRD_PARTY.md) for full context on why each is excluded
and how each is managed.

The desktop app source code itself lives in a separate repo:
[`egmtm/EGM-Downloader`](https://github.com/egmtm/EGM-Downloader).

---

## How updates reach the live site

```
Wizard delivers files
       ↓
EGM approves
       ↓
Commit lands on `main` branch
       ↓
EGM merges `main` → `live` branch (fast-forward only)
       ↓
GitHub webhook notifies cPanel
       ↓
cPanel pulls `live` branch
       ↓
.cpanel.yml allowlist copies only website files to /public_html/
       ↓
Live on egerena.com (~30 seconds end-to-end)
```

**Branches:**
- `main` — development, accumulates changes
- `live` — production, only what's currently visible to visitors

---

## Build artifacts

EGM Downloader desktop app build artifacts (`EGMd.zip`, `EGMdM.zip`,
`EGMdL.zip`, `EGMd-portable.zip`) and their JSON update feeds
(`egm-version.json`, `egmac-update.json`, `egmlinux-update.json`,
`egm-portable-version.json`) are uploaded to the server **manually by EGM**
after each release build. They are NOT in this repo and NOT touched by the
auto-deploy pipeline.

---

## Security

- All security headers configured in `.htaccess`
- HTTPS-only (HTTP → HTTPS 301 redirect)
- HSTS preload enabled
- Content Security Policy strictly limits external resources
- `config.php` chmod 600, blocked from web access via `.htaccess`
- Hidden files (`^\.`) blocked from web access via `.htaccess`

---

## Contact

EGM — contact@egerena.com
