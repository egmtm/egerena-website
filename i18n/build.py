#!/usr/bin/env python3
"""Builds the translated copies of the EGM Downloader landing page.

Source of truth : apps/egm-downloader.html  (English, edited by hand)
Translations    : i18n/<code>.json          ({"strings": {"English text": "Translated text"}})
Do not translate: i18n/keep.txt             (names that stay as written, one per line)
Output          : apps/<code>/egm-downloader.html

Only text and a short list of attributes are replaced; every tag is kept as is.
The build stops if an English string has no translation, so a copy edit in the
source cannot ship half translated.

    python3 i18n/build.py          build every language that has a strings file
    python3 i18n/build.py --list   print every translatable English string
"""
import glob
import html
import json
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'apps', 'egm-downloader.html')
SITE = 'https://egerena.com/apps/'
PAGE = 'egm-downloader.html'

TEXT_ATTRS = ('aria-label', 'alt', 'title', 'placeholder', 'data-short')
META_KEYS = ('description', 'og:title', 'og:description')
HAS_LETTER = re.compile(r'[^\W\d_]')
ATTR = re.compile(r'(\s)([a-zA-Z:-]+)=("([^"]*)"|\'([^\']*)\')')


def norm(s):
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()


class Pass(HTMLParser):
    """One walk over the source. With code=None it only collects strings."""

    def __init__(self, code, strings, keep):
        super().__init__(convert_charrefs=False)
        self.code, self.strings, self.keep = code, strings, keep
        self.out, self.buf = [], []
        self.found, self.missing = [], []
        self.skip = 0          # inside <script> or <style>
        self.cur_code = False  # next text is the current language code in the selector

    # -- text ---------------------------------------------------------------
    def flush(self):
        if not self.buf:
            return
        raw = ''.join(self.buf)
        self.buf = []
        if self.skip:
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
            raw = raw.replace('lang="en"', 'lang="%s"' % self.code)
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
            if lname in TEXT_ATTRS or lname.startswith('data-t-') or (is_meta and lname == 'content'):
                key = norm(val)
                if HAS_LETTER.search(key) and key not in self.keep:
                    self.found.append(key)
                    if self.code and key in self.strings:
                        new = html.escape(self.strings[key], quote=True)
                    elif self.code:
                        self.missing.append(key)
            elif self.code and lname in ('href', 'src') and not re.match(r'^(#|/|[a-zA-Z][a-zA-Z0-9+.-]*:)', val):
                new = '../' + val
            elif self.code and tag == 'link' and a.get('rel') == 'canonical' and lname == 'href':
                new = SITE + self.code + '/' + PAGE
            elif self.code and tag == 'meta' and meta_key == 'og:url' and lname == 'content':
                new = SITE + self.code + '/' + PAGE
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

    def handle_startendtag(self, tag, attrs):
        self.flush()
        self.out.append(self.tag_text(tag, attrs))

    def handle_endtag(self, tag):
        self.flush()
        if tag in ('script', 'style'):
            self.skip -= 1
        self.out.append('</%s>' % tag)

    def handle_comment(self, d):
        self.flush()
        self.out.append('<!--%s-->' % d)

    def handle_decl(self, d):
        self.flush()
        self.out.append('<!%s>' % d)
        if self.code:
            self.out.append('\n<!-- Generated by i18n/build.py from apps/egm-downloader.html. Edit the source and i18n/%s.json, not this file. -->' % self.code)

    def result(self):
        self.flush()
        return ''.join(self.out)


LOCALES = {'es': 'es_LA'}


def run(source, code, strings, keep):
    p = Pass(code, strings, keep)
    p.feed(source)
    p.close()
    return p


def main():
    source = open(SRC, encoding='utf-8').read()
    keep = {norm(l) for l in open(os.path.join(ROOT, 'i18n', 'keep.txt'), encoding='utf-8') if l.strip() and not l.startswith('#')}

    # The parser must reproduce the source byte for byte when nothing is translated.
    base = run(source, None, {}, keep)
    if base.result() != source:
        sys.exit('self test failed: the parser does not reproduce the source page')
    wanted = sorted(set(base.found))

    if '--list' in sys.argv:
        print('\n'.join(wanted))
        return

    files = sorted(glob.glob(os.path.join(ROOT, 'i18n', '*.json')))
    codes = [os.path.basename(f)[:-5] for f in files]
    alts = set(re.findall(r'<link rel="alternate" hreflang="([a-z-]+)"', source)) - {'x-default'}
    problems = []
    if alts != set(codes) | {'en'}:
        problems.append('hreflang links in the source %s do not match the strings files %s' % (sorted(alts), sorted(set(codes) | {'en'})))
    for c in codes:
        if 'data-lang="%s"' % c not in source:
            problems.append('the language list in the source has no entry for "%s"' % c)

    for f, c in zip(files, codes):
        data = json.load(open(f, encoding='utf-8'))
        strings = data['strings']
        p = run(source, c, strings, keep)
        miss = sorted(set(p.missing))
        if miss:
            problems.append('%s: %d untranslated string(s):\n    %s' % (c, len(miss), '\n    '.join(miss)))
            continue
        for k, v in strings.items():
            if re.findall(r'\{\d\}', k) != re.findall(r'\{\d\}', v):
                problems.append('%s: placeholder mismatch in "%s"' % (c, k))
        unused = sorted(set(strings) - set(wanted))
        if unused:
            print('note: %s has %d unused string(s) (the English text changed or was removed):\n    %s' % (c, len(unused), '\n    '.join(unused)))
        out = os.path.join(ROOT, 'apps', c, PAGE)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, 'w', encoding='utf-8', newline='\n').write(p.result())
        print('built apps/%s/%s  (%d strings)' % (c, PAGE, len(set(p.found))))
    if problems:
        sys.exit('\n'.join(['build stopped:'] + problems))


if __name__ == '__main__':
    main()
