#!/usr/bin/env python3
"""Builds the translated copies of the EGM Downloader landing page and the Videos page.

Source of truth : apps/egm-downloader.html, apps/egm-videos.html  (English, edited by hand)
Translations    : i18n/<code>.json          ({"strings": {"English text": "Translated text"}})
Do not translate: i18n/keep.txt             (names that stay as written, one per line)
Output          : apps/<code>/egm-downloader.html, apps/<code>/egm-videos.html

Only text and a short list of attributes are replaced; every tag is kept as is.
The build stops if an English string has no translation, so a copy edit in the
source cannot ship half translated.

Text inside an element marked translate="no" (release names, version numbers) is
never translated and needs no entry in keep.txt. The text of a <time datetime="YYYY-MM-DD">
element becomes the ISO date itself in every translated copy, so dates need no strings.
The two pages link to each other inside the language folder, so a visitor stays in
their language.

    python3 i18n/build.py          build every language that has a strings file
    python3 i18n/build.py --list   print every translatable English string (both pages)
"""
import glob
import html
import json
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://egerena.com/apps/'
PAGES = ['egm-downloader.html', 'egm-videos.html']  # English sources in apps/, each built for every language
SIBLING = re.compile(r'^(%s)([#?].*)?$' % '|'.join(re.escape(p) for p in PAGES))
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}
ISO_DATE = re.compile(r'^\d{4}-\d{2}-\d{2}$')

TEXT_ATTRS = ('aria-label', 'alt', 'title', 'placeholder', 'data-short')
META_KEYS = ('description', 'og:title', 'og:description')
HAS_LETTER = re.compile(r'[^\W\d_]')
ATTR = re.compile(r'(\s)([a-zA-Z:-]+)=("([^"]*)"|\'([^\']*)\')')


def norm(s):
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()


class Pass(HTMLParser):
    """One walk over the source. With code=None it only collects strings."""

    def __init__(self, code, strings, keep, page):
        super().__init__(convert_charrefs=False)
        self.code, self.strings, self.keep, self.page = code, strings, keep, page
        self.out, self.buf = [], []
        self.found, self.missing = [], []
        self.skip = 0          # inside <script> or <style>
        self.cur_code = False  # next text is the current language code in the selector
        self.stack = []        # open elements, to know where a translate="no" element ends
        self.nt = None         # stack depth of the open translate="no" element, if any
        self.time_iso = None   # the datetime of the <time> element whose text comes next

    # -- text ---------------------------------------------------------------
    def flush(self):
        if not self.buf:
            return
        raw = ''.join(self.buf)
        self.buf = []
        if self.skip or self.nt is not None:
            self.out.append(raw)
            return
        if self.time_iso is not None:
            iso, self.time_iso = self.time_iso, None
            if self.code and norm(raw):
                raw = raw[:len(raw) - len(raw.lstrip())] + iso + raw[len(raw.rstrip()):]
            self.out.append(raw)
            return
        if self.cur_code:
            self.cur_code = False
            self.out.append(self.code.upper() if self.code else raw)
            return
        key = norm(raw)
        if not key or not HAS_LETTER.search(key) or key in self.keep:
            self.out.append(raw)
            return
        self.found.append(key)
        if self.code is None:
            self.out.append(raw)
        elif key in self.strings:
            lead = raw[:len(raw) - len(raw.lstrip())]
            trail = raw[len(raw.rstrip()):]
            self.out.append(lead + html.escape(self.strings[key], quote=False) + trail)
        else:
            self.missing.append(key)
            self.out.append(raw)

    def handle_data(self, d):
        self.buf.append(d)

    def handle_entityref(self, n):
        self.buf.append('&%s;' % n)

    def handle_charref(self, n):
        self.buf.append('&#%s;' % n)

    # -- tags ---------------------------------------------------------------
    def tag_text(self, tag, attrs):
        raw = self.get_starttag_text()
        a = dict(attrs)
        if tag == 'html' and self.code:
            raw = raw.replace('lang="en"', 'lang="%s"%s' % (self.code, ' dir="rtl"' if self.code in RTL else ''))
        if tag == 'span' and 'lang-cur' in (a.get('class') or ''):
            self.cur_code = True
        if self.code and tag == 'a' and a.get('data-lang') is not None:
            raw = raw.replace(' aria-current="true"', '')
            if a['data-lang'] == self.code:
                raw = raw[:-1] + ' aria-current="true">'
        meta_key = a.get('name') or a.get('property') or ''
        is_meta = tag == 'meta' and meta_key in META_KEYS

        def sub(m):
            name, val = m.group(2), m.group(4) if m.group(4) is not None else m.group(5)
            lname = name.lower()
            new = val
            if self.nt is None and (lname in TEXT_ATTRS or lname.startswith('data-t-') or (is_meta and lname == 'content')):
                key = norm(val)
                if HAS_LETTER.search(key) and key not in self.keep:
                    self.found.append(key)
                    if self.code and key in self.strings:
                        new = html.escape(self.strings[key], quote=True)
                    elif self.code:
                        self.missing.append(key)
            elif self.code and lname in ('href', 'src') and not re.match(r'^(#|/|[a-zA-Z][a-zA-Z0-9+.-]*:)', val):
                # The two pages live side by side in every language folder; everything else is one level up.
                new = val if lname == 'href' and SIBLING.match(val) else '../' + val
            elif self.code and tag == 'link' and a.get('rel') == 'canonical' and lname == 'href':
                new = SITE + self.code + '/' + self.page
            elif self.code and tag == 'meta' and meta_key == 'og:url' and lname == 'content':
                new = SITE + self.code + '/' + self.page
            if new == val:
                return m.group(0)
            return '%s%s="%s"' % (m.group(1), name, new)

        raw = ATTR.sub(sub, raw)
        if self.code and tag == 'meta' and meta_key == 'og:title':
            raw = '<meta property="og:locale" content="%s">\n    ' % LOCALES.get(self.code, self.code) + raw
        return raw

    def handle_starttag(self, tag, attrs):
        self.flush()
        self.out.append(self.tag_text(tag, attrs))
        if tag in ('script', 'style'):
            self.skip += 1
        if tag not in VOID:
            self.stack.append(tag)
            if self.nt is None and dict(attrs).get('translate') == 'no':
                self.nt = len(self.stack)
        if tag == 'time':
            iso = dict(attrs).get('datetime')
            self.time_iso = iso if iso and ISO_DATE.match(iso) else None

    def handle_startendtag(self, tag, attrs):
        self.flush()
        self.out.append(self.tag_text(tag, attrs))

    def handle_endtag(self, tag):
        self.flush()
        if tag in ('script', 'style'):
            self.skip -= 1
        if tag == 'time':
            self.time_iso = None
        if tag not in VOID and tag in self.stack:
            while self.stack.pop() != tag:  # tolerate optional end tags such as </li>
                pass
            if self.nt is not None and len(self.stack) < self.nt:
                self.nt = None
        self.out.append('</%s>' % tag)

    def handle_comment(self, d):
        self.flush()
        self.out.append('<!--%s-->' % d)

    def handle_decl(self, d):
        self.flush()
        self.out.append('<!%s>' % d)
        if self.code:
            self.out.append('\n<!-- Generated by i18n/build.py from apps/%s. Edit the source and i18n/%s.json, not this file. -->' % (self.page, self.code))

    def result(self):
        self.flush()
        return ''.join(self.out)


LOCALES = {'es': 'es_LA', 'de': 'de_DE', 'fr': 'fr_FR', 'it': 'it_IT', 'pt': 'pt_BR', 'nl': 'nl_NL', 'ru': 'ru_RU', 'ja': 'ja_JP', 'ar': 'ar_AR'}

RTL = {'ar'}  # languages written right to left: the page gets dir="rtl"


def run(source, code, strings, keep, page):
    p = Pass(code, strings, keep, page)
    p.feed(source)
    p.close()
    return p


def main():
    keep = {norm(l) for l in open(os.path.join(ROOT, 'i18n', 'keep.txt'), encoding='utf-8') if l.strip() and not l.startswith('#')}

    sources, wanted = {}, set()
    for page in PAGES:
        source = open(os.path.join(ROOT, 'apps', page), encoding='utf-8').read()
        # The parser must reproduce each source byte for byte when nothing is translated.
        base = run(source, None, {}, keep, page)
        if base.result() != source:
            sys.exit('self test failed: the parser does not reproduce apps/%s' % page)
        sources[page] = source
        wanted |= set(base.found)
    wanted = sorted(wanted)

    if '--list' in sys.argv:
        print('\n'.join(wanted))
        return

    files = sorted(glob.glob(os.path.join(ROOT, 'i18n', '*.json')))
    codes = [os.path.basename(f)[:-5] for f in files]
    problems = []
    for page, source in sources.items():
        alts = set(re.findall(r'<link rel="alternate" hreflang="([a-z-]+)"', source)) - {'x-default'}
        if alts != set(codes) | {'en'}:
            problems.append('apps/%s: hreflang links %s do not match the strings files %s' % (page, sorted(alts), sorted(set(codes) | {'en'})))
        for c in codes:
            if 'data-lang="%s"' % c not in source:
                problems.append('apps/%s: the language list has no entry for "%s"' % (page, c))

    for f, c in zip(files, codes):
        data = json.load(open(f, encoding='utf-8'))
        strings = data['strings']
        built, bad = [], False
        for page, source in sources.items():
            p = run(source, c, strings, keep, page)
            miss = sorted(set(p.missing))
            if miss:
                problems.append('%s, apps/%s: %d untranslated string(s):\n    %s' % (c, page, len(miss), '\n    '.join(miss)))
                bad = True
            built.append((page, p))
        if bad:
            continue
        for k, v in strings.items():
            if re.findall(r'\{\d\}', k) != re.findall(r'\{\d\}', v):
                problems.append('%s: placeholder mismatch in "%s"' % (c, k))
        unused = sorted(set(strings) - set(wanted))
        if unused:
            print('note: %s has %d unused string(s) (the English text changed or was removed):\n    %s' % (c, len(unused), '\n    '.join(unused)))
        for page, p in built:
            out = os.path.join(ROOT, 'apps', c, page)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            open(out, 'w', encoding='utf-8', newline='\n').write(p.result())
            print('built apps/%s/%s  (%d strings)' % (c, page, len(set(p.found))))
    if problems:
        sys.exit('\n'.join(['build stopped:'] + problems))


if __name__ == '__main__':
    main()
