#!/usr/bin/env python3
"""Builds the theme page (/themes/) from the EGM Downloader source.

Usage:
    python3 tools/theme-page/build.py <path to the app source> [--rev <commit>]

<path> holds the app's templates/ and languages/ folders (a checkout of the
app repo, or an export of them). Run from anywhere; paths are relative to this
website repo.

Reads the app's own markup, CSS, theme list and language files, and writes:
    themes/app.css       the app's CSS, scoped to the preview (themes included)
    themes/app-data.js   theme list, categories and the app strings in every language
    themes/index.html    the page, from tools/theme-page/page.html

The page's own files (themes/themes.css, themes/preview.css, themes/themes.js) are written by hand.
The site header and footer are copied from apps/egm-videos.html, so they stay the same as on the other pages.
Run this after each app update the page should follow, then python3 i18n/build.py for the nine
translated copies (themes/<code>/index.html, from the site's i18n/<code>.json), then commit the result.
This folder (tools/) is not deployed.
"""
import hashlib
import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
SITE = HERE.parent.parent
OUT = SITE / 'themes'


def die(msg):
    sys.exit('build.py: ' + msg)


args = sys.argv[1:]
if not args:
    die('give the path to the app source (the folder with templates/ and languages/)')
APP = pathlib.Path(args[0]).resolve()
REV = args[args.index('--rev') + 1] if '--rev' in args else ''
T = APP / 'templates'
L = APP / 'languages'
for p in (T / 'index.html', T / 'index_styles.html', T / 'theme_styles.html', T / 'themes.html',
          T / 'theme_data.html', T / 'i18n.html', T / 'js' / '_theme.html', L / 'en.json'):
    if not p.is_file():
        die('missing %s' % p)


def read(p):
    return p.read_text(encoding='utf-8')


idx = read(T / 'index.html')
sty = read(T / 'index_styles.html')
tst = read(T / 'theme_styles.html')
thm = read(T / 'themes.html')
tdata = read(T / 'theme_data.html')
i18n = read(T / 'i18n.html')
theme_js = read(T / 'js' / '_theme.html')


# ---------------------------------------------------------------- theme list
THEMES = {}
for m in re.finditer(r"^\s*'?([\w-]+)'?\s*:\s*\{label:\s*(?:'([^']*)'|\"([^\"]*)\")\s*,\s*bg:'([^']+)'\s*,\s*surf:'([^']+)'\s*,\s*acc:'([^']+)'\s*,\s*cat:'([\w-]+)'\s*\}", tdata, re.M):
    key, l1, l2, bg, surf, acc, cat = m.groups()
    if key == 'custom':
        continue   # the app's placeholder for an imported theme, not a theme
    THEMES[key] = {'label': l1 if l1 is not None else l2, 'bg': bg, 'surf': surf, 'acc': acc, 'cat': cat}
declared = len(re.findall(r"^\s*'?[\w-]+'?\s*:\s*\{label:", tdata, re.M)) - 1
if len(THEMES) != declared or len(THEMES) < 100:
    die('read %d themes from theme_data.html, expected %d' % (len(THEMES), declared))

# Seasonal windows: the app's own table and function, copied as they are (the page shows a seasonal
# theme only inside its window, by the visitor's own date, like the app)
m = re.search(r"const SEASONAL_FIXED = \{.*?\nfunction seasonalVisibleKeys\(now = new Date\(\)\) \{.*?\n\}\n", tdata, re.S)
if not m:
    die('could not find the seasonal windows in theme_data.html')
SEASONAL_JS = m.group(0)
seasonal_keys = {k for k, d in THEMES.items() if d['cat'] == 'seasonal'}
listed = set(re.findall(r"^\s*([\w-]+)\s*:", SEASONAL_JS, re.M))
if not seasonal_keys <= listed:
    die('seasonal themes without a window: %s' % sorted(seasonal_keys - listed))

m = re.search(r"const THEMES = \[(.*?)\];", theme_js, re.S)
ORDER = [k for k in re.findall(r"'([\w-]+)'", m.group(1)) if k != 'custom']
missing = [k for k in ORDER if k not in THEMES]
if missing:
    die('order list names unknown themes: %s' % missing[:5])

m = re.search(r"const SECTIONS = \[(.*?)\];", thm, re.S)
SECTIONS = [{'label': a, 'key': b, 'cats': re.findall(r"'([\w-]+)'", c)}
            for a, b, c in re.findall(r"label:\s*'([^']+)',\s*key:\s*'([^']+)',\s*cats:\s*\[([^\]]*)\]", m.group(1))]
m = re.search(r"const CAT_LABELS = \{(.*?)\};", thm, re.S)
CAT_LABELS = dict(re.findall(r"([\w-]+)\s*:\s*'([^']*)'", m.group(1)))
if not SECTIONS or not CAT_LABELS:
    die('could not read the All Themes sections or category names')

codes = re.findall(r"'(\w+)'", re.search(r"const I18N_SUPPORTED = \[(.*?)\]", i18n).group(1))
rtl = re.findall(r"'(\w+)'", re.search(r"const I18N_RTL = \[(.*?)\]", i18n).group(1))
names = dict(re.findall(r"(\w+):\s*'([^']+)'", re.search(r"const I18N_NAMES = \{(.*?)\};", i18n, re.S).group(1)))
STR = {}
for c in codes:
    j = json.loads(read(L / (c + '.json')))
    STR[c] = j['strings']


# ---------------------------------------------------------------- CSS
def strip_comments(css):
    return re.sub(r'/\*.*?\*/', '', css, flags=re.S)


def parse_blocks(css):
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j == -1:
            break
        head = css[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            if css[k] == '{':
                depth += 1
            elif css[k] == '}':
                depth -= 1
            k += 1
        out.append((head, css[j + 1:k - 1]))
        i = k
    return out


def split_sel(sel):
    parts, depth, cur = [], 0, ''
    for ch in sel:
        if ch in '([':
            depth += 1
        elif ch in ')]':
            depth -= 1
        if ch == ',' and depth == 0:
            parts.append(cur.strip())
            cur = ''
        else:
            cur += ch
    parts.append(cur.strip())
    return [p for p in parts if p]


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


def map_sel(s, inner, frame):
    """App selector -> page selector.
    The frame (.egm plus .egm-w or .egm-a) stands for the app's window: theme variables, texture layer, and the
    parts docked to the window (Theme Creator, toasts, dialogs). `inner` (.egm-main or .egm-atw) is the app's
    body inside it (layout, font, scrolling)."""
    rtl = False
    if s.startswith('[dir=rtl] '):
        rtl, s = True, s[len('[dir=rtl] '):]
    if re.search(r'(?<![\w.#-])html\b|\.card-reordering body', s):
        return None
    if s == ':root':
        return '.egm'
    if s in ('*', '*::before', '*::after'):
        return '.egm ' + s if s != '*' else '.egm, .egm *'

    def body(mm):
        rest = mm.group(1) or ''
        out = inner
        for cls in re.findall(r'\.([\w-]+)', rest):
            out = ('.egm.t-' + cls) if cls in THEMES else out + '.' + cls
        return out
    s2 = re.sub(r'(?<![\w.#-])body((?:\.[\w-]+)*)(?![\w-])', body, s)
    if s2 != s:
        # body::before and body > * belong to the frame (texture layer above the theme background)
        s2 = re.sub('^' + re.escape(inner) + r'(::before| > \*)$', r'.egm\1', s2)
    else:
        s2 = frame + ' ' + s2
    if rtl:
        s2 = '.egm[dir=rtl] ' + (s2[len(frame) + 1:] if s2.startswith(frame + ' ') else s2)
    return s2


def scope(css, inner, frame):
    css = strip_comments(css)
    res = []
    for head, body in parse_blocks(css):
        if head.startswith('@keyframes') or head.startswith('@-webkit-keyframes') or head.startswith('@font-face'):
            res.append(head + '{' + norm(body) + '}')
            continue
        if head.startswith('@media') or head.startswith('@supports'):
            inner_css = scope(body, inner, frame)
            if inner_css:
                res.append(head + '{' + inner_css + '}')
            continue
        if head.startswith('@'):
            continue
        keep = [x for x in (map_sel(s, inner, frame) for s in split_sel(head)) if x]
        if keep:
            res.append(','.join(keep) + '{' + norm(body) + '}')
    return '\n'.join(res)


INC = "{% include 'theme_styles.html' %}"
if sty.count(INC) != 1 or thm.count(INC) != 1:
    die('theme_styles include not found once in index_styles.html and themes.html')
before, after = sty.split(INC)
thm_css = re.search(r'<style>(.*?)</style>', thm, re.S).group(1).replace(INC, '')
if '{%' in before + after + thm_css or '{{' in before + after + thm_css:
    die('template tag left in the app CSS')
APP_CSS = '\n'.join([
    '/* Generated by tools/theme-page/build.py from the EGM Downloader source%s. Do not edit by hand. */' % (' ' + REV if REV else ''),
    '/* Main window (index_styles.html) */', scope(before, '.egm-main', '.egm-w'),
    '/* Themes (theme_styles.html) */', scope(tst, '.egm-main', '.egm-w'),
    scope(after, '.egm-main', '.egm-w'),
    '/* All Themes window (themes.html) */', scope(thm_css, '.egm-atw', '.egm-a'),
]) + '\n'


# ---------------------------------------------------------------- markup
USED = set()


def keys_in(h):
    for k in re.findall(r'data-i18n="([^"]+)"', h):
        USED.add(k)
    for pairs in re.findall(r'data-i18n-attr="([^"]+)"', h):
        for p in pairs.split(','):
            USED.add(p.split(':', 1)[1].strip())
    return h


def clean(h):
    h = re.sub(r'<!--.*?-->', '', h, flags=re.S)
    h = re.sub(r'\s(?:onclick|onchange|oninput|ondragstart|ondrop)="[^"]*"', '', h, flags=re.I)
    h = re.sub(r'\n\s*\n+', '\n', h)
    if '{%' in h or '{{' in h:
        die('template tag left in markup: ' + re.search(r'\{[%{].{0,60}', h).group(0))
    return keys_in(h.strip())


def cut(src, start_pat, end_pat, what):
    m = re.search(start_pat + '.*?' + end_pat, src, re.S)
    if not m:
        die('could not find ' + what)
    return m.group(0)


header = cut(idx, r'<header>', r'</header>', 'the header')
header = re.sub(r'\s*<div class="hpanel-content" id="hpanel-history">.*?(?=<!-- Themes tab -->)', '\n', header, flags=re.S)
header = re.sub(r'\s*<!-- Advanced tab -->.*?(?=\s*</div>\s*</div>\s*</header>)', '', header, flags=re.S)
header = re.sub(r'<div style="display:none" id="theme-list-static">.*?<!-- end theme-list-static -->', '', header, flags=re.S)
if 'hpanel-advanced' in header or 'theme-list-static' in header or 'hpanel-history"' in header:
    die('the header still holds a panel the page leaves out')
header = clean(header)

urls = clean(cut(idx, r'<div class="card" id="urls-card">', r'(?=<!-- Unified settings panel -->)', 'the links card'))
settings = clean(cut(idx, r'<div class="unified-panel" id="settings-panel-wrap">', r'(?=<div class="sec-body collapsed" id="settings-body">)', 'the settings header') + '</div>')
bulk = cut(idx, r'<div id="bulk-bar">', r'</div>', 'the queue bar')
bulk = clean(bulk.replace('<div id="bulk-bar">', '<div id="bulk-bar" class="show">', 1)
             .replace('<span id="bulk-txt">Downloading…</span>', '<span id="bulk-txt" data-tp-text="bulk"></span>', 1))
footer = cut(idx, r'<footer>', r'</footer>', 'the footer')
footer = re.sub(r'\s*<button id="footer-version-pill".*?</button>', '', footer, flags=re.S)   # no version on the page
footer = footer.replace('{{ platform_url }}', 'https://egerena.com/apps/egm.html')               # the Windows build's value (app.py)
footer = footer.replace(';display:none">', '">', 1)                                                # the app shows the selector by default
footer = clean(footer)

# Sample download cards: the markup of the card template in js/_download.html, with invented videos.
for k in ['tooltip.card.remove', 'card.badge.live', 'card.label.format', 'card.format.video', 'card.format.audio',
          'card.label.video_quality', 'card.quality.best', 'subscriptions.menu.move_up', 'subscriptions.menu.move_down',
          'status.ready', 'card.btn.download', 'card.btn.cancel', 'card.btn.pause', 'card.btn.resume', 'card.btn.stop_save',
          'card.status.eta', 'card.status.recording', 'card.status.paused', 'bulk.progress.mixed']:
    USED.add(k)


def t(key):
    return '<span data-i18n="%s">%s</span>' % (key, STR['en'][key].replace('&', '&amp;').replace('<', '&lt;'))


def attr(key):
    return STR['en'][key].replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')


def card(n, title, uploader, dur, grad, state, sel, pct=0):
    qs = ['2160p - 4K', '1440p - 2K', '1080p', '720p', '480p']
    vopts = ''.join('<option%s>%s</option>' % (' selected' if q == sel else '', q) for q in qs)
    live = state in ('recording', 'paused')
    thumb = '<div class="thumb"><div class="tp-thumb" style="background:%s"></div>%s</div>' % (grad, '' if live else '<span class="dur">%s</span>' % dur)
    meta = ('<span class="live-tag">%s</span> <bdi>%s</bdi>' % (t('card.badge.live'), uploader)) if live else ('<bdi>%s</bdi> · %s' % (uploader, dur))
    if state == 'ready':
        controls = ('<div style="display:flex;gap:3px;flex-shrink:0" id="qarrows%d">'
                    '<button class="btn btn-ghost btn-sm qarrow" data-i18n-attr="title:subscriptions.menu.move_up" title="%s" style="padding:2px 6px;font-size:11px">↑</button>'
                    '<button class="btn btn-ghost btn-sm qarrow" data-i18n-attr="title:subscriptions.menu.move_down" title="%s" style="padding:2px 6px;font-size:11px;visibility:hidden">↓</button></div>'
                    '<span class="badge b-wait" id="st%d">%s</span>'
                    '<button class="btn btn-primary btn-sm" id="dl%d">⬇ %s</button>') % (
            n, attr('subscriptions.menu.move_up'), attr('subscriptions.menu.move_down'), n, t('status.ready'), n, t('card.btn.download'))
        prog = '<div class="prog" id="prog%d" style="display:none"><div class="prog-inner indeterminate"></div></div>' % n
    else:
        badge = ('<span class="badge b-wait" id="st%d" data-tp-text="%s"></span>' % (n, state)) if state == 'paused' else \
                ('<span class="badge b-dl" id="st%d"><span class="spinner"></span> <span data-tp-text="%s"></span></span>' % (n, state))
        live_btns = ''
        if live:   # js/_download.html addStopSave and setLivePauseButtons: Pause while recording, Resume while paused, both before Stop and save
            live_btns = ('<button class="btn btn-sm btn-pause" id="pause%d"%s>❚❚ %s</button>'
                         '<button class="btn btn-sm btn-resume" id="resume%d"%s>▶ %s</button>'
                         '<button class="btn btn-green btn-sm" id="stop%d">■ %s</button>') % (
                n, ' style="display:none"' if state == 'paused' else '', t('card.btn.pause'),
                n, '' if state == 'paused' else ' style="display:none"', t('card.btn.resume'), n, t('card.btn.stop_save'))
        controls = ('<div style="display:none" id="qarrows%d"></div>%s'
                    '<button class="btn btn-primary btn-sm" id="dl%d" disabled style="display:none">⬇ %s</button>%s'
                    '<button class="btn btn-red btn-sm" id="cancel%d">✕ %s</button>') % (n, badge, n, t('card.btn.download'), live_btns, n, t('card.btn.cancel'))
        if state == 'paused':
            prog = '<div class="prog" id="prog%d"><div class="prog-inner" style="width:0"></div></div>' % n
        elif live:
            prog = '<div class="prog" id="prog%d"><div class="prog-inner indeterminate"></div></div>' % n
        else:
            prog = '<div class="prog" id="prog%d"><div class="prog-inner" style="width:%d%%"></div></div>' % (n, pct)
    return (
        '<div class="vcard" id="card%d">'
        '<button class="vcard-remove" data-i18n-attr="title:tooltip.card.remove" title="%s" data-id="%d">✕</button>%s'
        '<div class="vbody">'
        '<div class="vtitle" dir="auto" title="%s">%s</div>'
        '<div class="vmeta">%s</div>'
        '<div class="qual-panel">'
        '<div class="qual-group"><span class="qual-label">%s</span><div class="pills">'
        '<input type="radio" name="fmt%d" id="fv%d" value="video" checked><label for="fv%d">🎬 %s</label>'
        '<input type="radio" name="fmt%d" id="fa%d" value="audio"><label for="fa%d">🎵 %s</label>'
        '</div></div>'
        '<div class="qual-group" id="vqg%d"><span class="qual-label">%s</span>'
        '<select class="qsel" id="vq%d"><option value="">%s</option>%s</select></div>'
        '</div>'
        '<div class="vcontrols">%s</div>%s'
        '</div></div>'
    ) % (n, attr('tooltip.card.remove'), n, thumb, title, title, meta, t('card.label.format'),
         n, n, n, t('card.format.video'), n, n, n, t('card.format.audio'),
         n, t('card.label.video_quality'), n, t('card.quality.best'), vopts, controls, prog)


CARDS = (
    card(1, 'Mountain Rail Journey, Cab View Through the Snow', 'Highline Rail Films', '47:36',
         'linear-gradient(180deg,#8cc4ea 0%,#f6dcc0 55%,#6d86a8 55%,#4a6283 100%)', 'downloading', '1440p - 2K', 41)
    + card(2, 'Fjord Ferry Terminal Cam, Morning Departures', 'Nordland Webcams', '',
           'linear-gradient(180deg,#2a2a5e 0%,#e8705a 52%,#1b3354 52%,#1b3354 100%)', 'recording', '1080p')
    + card(3, 'City Marathon Finish Line, Live Coverage', 'Harborview Sports Desk', '',
           'linear-gradient(180deg,#3d4f6e 0%,#9fb3c8 48%,#59606b 48%,#2f343c 100%)', 'paused', '1080p')
    + card(4, 'Sourdough Starter Day by Day, Time Lapse', 'Hearth and Crumb', '09:42',
           'linear-gradient(135deg,#f4e3c8 0%,#e0c39a 100%)', 'ready', '1080p')
)
keys_in(CARDS)

# The Theme Creator panel (index.html), docked in the window as in the app. The page has no Save: there is no app
# library to save into here (Export gives the .json to import in the app).
creator = cut(idx, r'<aside id="creator-panel"', r'</aside>', 'the Theme Creator panel')
creator, n_save = re.subn(r'\s*<button class="cvp-btn cvp-save" id="cvp-save"[^>]*>.*?</button>', '', creator, flags=re.S)
if n_save != 1:
    die('could not take the Save button out of the Theme Creator panel')
creator = creator.replace('<aside id="creator-panel"', '<aside id="creator-panel" hidden', 1)
creator = re.sub(r'(\s*</div>\s*<div class="cvp-foot">)',
                 r'\n    <p class="tp-cvp-note" dir="auto">Export saves a .json file. In the app, open Themes and choose Import.</p>\1', creator, count=1)
if 'tp-cvp-note' not in creator:
    die('could not add the export note to the Theme Creator panel')
CREATOR = clean(creator) + '\n<div id="toasts"></div>'

# The Creator's color math and the theme variable check, copied as they are from the app
cre = read(T / 'js' / '_creator.html')
m1 = re.search(r"  const CORE_KEYS     = \[.*?\};\n", cre, re.S)
m2 = re.search(r"  function hexToRgb\(h\) \{.*?\n  function validPairs\(map\) \{.*?\n  \}\n", cre, re.S)
m3 = re.search(r"const _TV_COLOR = .*?\nfunction validateThemeVar\(name, value\) \{.*?\n\}\n", read(T / 'theme_validator.html'), re.S)
if not (m1 and m2 and m3):
    die('could not find the Theme Creator color code or the theme variable check')
CREATOR_JS = m3.group(0) + m1.group(0) + m2.group(0)

APP_WINDOW = (header + '\n' + urls + '\n' + settings + '\n' + bulk + '\n<div id="results">' + CARDS + '</div>\n' + footer)

atw_body = re.search(r'<body>(.*?)<div class="modal-backdrop" id="delete-theme-modal"', thm, re.S).group(1)
atw_body = atw_body.replace('<div style="-webkit-app-region:no-drag">', '<div>', 1)
# The app's window has an OS close button; the page panel gets its own (NEW: on the page only).
atw_body = re.sub(r'(<div class="search-wrap">.*?</div>)',
                  r'\1\n  <button type="button" class="tp-atw-close" id="tp-atw-close" data-i18n-attr="title:creator.btn.close,aria-label:creator.btn.close" title="Close" aria-label="Close">&times;</button>',
                  atw_body, count=1, flags=re.S)
ALL_THEMES = clean(atw_body)

# Strings the page script uses directly
for k in (['toast.creator.name_first', 'theme.export.success', 'toast.export_failed', 'creator.placeholder.theme_name',
           'creator.modal.close.title', 'creator.modal.close.body2', 'creator.modal.close.keep', 'creator.modal.close.confirm',
           'creator.modal.reset.title', 'creator.modal.reset.body', 'creator.modal.overwrite.cancel', 'creator.btn.reset',
           'themes.filter.all', 'themes.tab.seasonal', 'themes.filter.seasonal', 'themes.no_results', 'themes.search.results_one',
           'themes.search.results_many', 'themes.breadcrumb.count_one', 'themes.breadcrumb.count_many', 'lang.selector.tooltip',
           'creator.btn.close']
          + [s['key'] for s in SECTIONS] + ['themes.cat.' + c for s in SECTIONS for c in s['cats'] if c != 'custom']):
    USED.add(k)
bad = sorted(k for k in USED if k not in STR['en'])
if bad:
    die('keys missing in en.json: %s' % bad)


# ---------------------------------------------------------------- site chrome (the same header and footer as the Videos page)
vid = read(SITE / 'apps' / 'egm-videos.html')
js = read(SITE / 'apps' / 'egm-downloader.js')
SITE_LKEY = re.search(r"var LKEY = '([\w-]+)';", js).group(1)
SPRITE = cut(vid, r'<svg class="sr"', r'</defs></svg>', 'the logo sprite on the Videos page')
SKIP = cut(vid, r'<a class="skip"', r'</a>', 'the skip link on the Videos page')
HDR = cut(vid, r'<header class="wrap hdr">', r'</header>', 'the header on the Videos page')
FTR = cut(vid, r'<footer class="wrap foot">', r'</footer>', 'the footer on the Videos page')
land = read(SITE / 'apps' / 'egm-downloader.html')
VLINK = re.search(r'\s*<a class="navl" href="egm-videos.html">Videos</a>', land)
if not VLINK:
    die('could not find the Videos link in the landing page footer')


def site_paths(h):
    # The Videos page sits in /apps/; this page is in /themes/
    h = re.sub(r'href="(egm-[\w-]+\.html[^"]*)"', r'href="/apps/\1"', h)
    return h


HDR = site_paths(HDR).replace(' aria-current="page"', '')
# Same nav as the Videos page, with this page first and marked as the current one (as Videos is there)
HDR, n_nav = re.subn(r'(<a class="navl" href="/apps/egm-videos\.html">)', r'<a class="navl" href="/themes/" aria-current="page">Themes</a>\n        \1', HDR, count=1)
if n_nav != 1:
    die('could not add the Themes link to the header')
# Language menu: each entry goes to this page in that language (/themes/ and /themes/<code>/, built by i18n/build.py)
HDR = re.sub(r'href="/apps/((?:\w\w/)?)egm-videos\.html" hreflang', r'href="/themes/\1" hreflang', HDR)
FTR = site_paths(FTR)
FTR = FTR.replace('<nav class="foot-nav" aria-label="Elsewhere">', '<nav class="foot-nav" aria-label="Elsewhere">' + site_paths(VLINK.group(0)), 1)
if 'egm-videos.html" hreflang' in HDR or 'hreflang' not in HDR:
    die('the language menu links were not rewritten')


# ---------------------------------------------------------------- write
data = {
    'source': REV,
    'themes': THEMES,
    'order': ORDER,
    'sections': SECTIONS,
    'catLabels': CAT_LABELS,
    'langs': {'codes': codes, 'rtl': rtl, 'names': names},
    'strings': {c: {k: STR[c][k] for k in sorted(USED) if k in STR[c]} for c in codes},
    'site': {'langKey': SITE_LKEY},
}
DATA_JS = ('/* Generated by tools/theme-page/build.py from the EGM Downloader source%s. Do not edit by hand. */\n'
           'window.TP_DATA = %s;\n'
           '/* Seasonal windows, from the app\'s theme_data.html */\n'
           '(function () {\n%s'
           'window.TP_DATA.seasonalVisibleKeys = seasonalVisibleKeys;\n'
           '})();\n'
           '/* Theme Creator color math (js/_creator.html) and the theme variable check (theme_validator.html) */\n'
           '(function () {\n%s'
           'window.TP_DATA.creator = { CORE_KEYS: CORE_KEYS, CORE_DEFAULTS: CORE_DEFAULTS, hexToRgb: hexToRgb, relLum: relLum, mix: mix,\n'
           '  toHex6: toHex6, deriveAll: deriveAll, validPairs: validPairs, validateThemeVar: validateThemeVar };\n'
           '})();\n') % (' ' + REV if REV else '', json.dumps(data, ensure_ascii=False, separators=(',', ':')), SEASONAL_JS, CREATOR_JS)

OUT.mkdir(exist_ok=True)
(OUT / 'app.css').write_text(APP_CSS, encoding='utf-8')
(OUT / 'app-data.js').write_text(DATA_JS, encoding='utf-8')


def ver(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()[:10]


page = read(HERE / 'page.html')
for tag, val in {
    '<!--@APP_WINDOW@-->': APP_WINDOW,
    '<!--@ALL_THEMES@-->': ALL_THEMES,
    '<!--@CREATOR@-->': CREATOR,
    '<!--@SITE_SPRITE@-->': SPRITE,
    '<!--@SITE_SKIP@-->': SKIP,
    '<!--@SITE_HEADER@-->': HDR,
    '<!--@SITE_FOOTER@-->': FTR,
    '@V_PREVIEW_CSS@': ver(OUT / 'preview.css'),
    '@V_SITE_CSS@': re.search(r'egm-downloader\.css\?v=(\w+)', vid).group(1),
    '@V_SITE_JS@': re.search(r'egm-downloader\.js\?v=(\w+)', vid).group(1),
    '@V_APP_CSS@': ver(OUT / 'app.css'),
    '@V_APP_DATA@': ver(OUT / 'app-data.js'),
    '@V_PAGE_CSS@': ver(OUT / 'themes.css'),
    '@V_PAGE_JS@': ver(OUT / 'themes.js'),
}.items():
    if page.count(tag) != 1 and not (tag.startswith('@V_') and page.count(tag) > 1):
        die('page.html must hold %s once' % tag)
    page = page.replace(tag, val)
(OUT / 'index.html').write_text(page, encoding='utf-8')

print('themes: %d, order: %d, sections: %d, languages: %d, strings per language: %d' % (
    len(THEMES), len(ORDER), len(SECTIONS), len(codes), len(USED)))
for p in ('app.css', 'app-data.js', 'index.html'):
    print('wrote themes/%s (%d bytes)' % (p, (OUT / p).stat().st_size))
