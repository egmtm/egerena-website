/* Back to top button for every page of the site. One file: it draws the button, shows it after 400 px of
   scrolling (one screen on a shorter window) and scrolls back to the top. The colors come from each page's
   own theme variables, chosen by data-look on the script tag (egm, win, mac, linux, portfolio, apps, games),
   so the button follows the theme the visitor picked. On the EGM Downloader pages the button is in the page
   (the i18n build translates its label); on the other pages this file adds it. Nothing is stored and nothing
   is sent. */
(function () {
  'use strict';
  var d = document, w = window;
  var look = (d.currentScript && d.currentScript.getAttribute('data-look')) || 'egm';

  var css =
    '.egm-top{--tt-s:var(--surf);--tt-b:var(--bg);--tt-l:var(--line);--tt-a:var(--accT);--tt-y:16px;' +
      'position:fixed;inset-inline-end:16px;bottom:var(--tt-y);z-index:40;width:44px;height:44px;padding:0;' +
      'border-radius:999px;border:1.5px solid var(--tt-l);background:linear-gradient(var(--tt-s),var(--tt-s)),var(--tt-b);' +
      'color:var(--tt-a);display:flex;align-items:center;justify-content:center;cursor:pointer;' +
      '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);animation:egm-top-in .18s ease-out}' +
    '.egm-top[hidden]{display:none}' +
    '.egm-top:hover{border-color:var(--tt-a)}' +
    '.egm-top:focus-visible{outline:3px solid var(--tt-a);outline-offset:3px}' +
    '.egm-top svg{width:20px;height:20px}' +
    '[data-egm-top]:focus{outline:0}' +
    '.egm-top[data-look="win"]{--tt-s:var(--surface);--tt-b:var(--bg);--tt-l:var(--border);--tt-a:var(--accent)}' +
    '.egm-top[data-look="mac"]{--tt-s:var(--glass-bg);--tt-b:transparent;--tt-l:var(--glass-border);--tt-a:var(--link-color)}' +
    '.egm-top[data-look="linux"]{--tt-s:var(--terminal-bg);--tt-b:var(--terminal-bg);--tt-l:var(--terminal-dim);--tt-a:var(--terminal-color);--tt-y:4.25rem}' +
    '.egm-top[data-look="portfolio"]{--tt-s:var(--tag-bg);--tt-b:var(--bg);--tt-l:var(--border);--tt-a:var(--fg)}' +
    '.egm-top[data-look="apps"]{--tt-s:var(--navy-mid);--tt-b:var(--navy-deep);--tt-l:var(--navy-light);--tt-a:var(--cyan-bright)}' +
    '.egm-top[data-look="games"]{--tt-s:var(--card-bg);--tt-b:var(--bg);--tt-l:var(--card-bd);--tt-a:var(--accent)}' +
    '@keyframes egm-top-in{from{opacity:0;transform:translateY(6px)}}' +
    '@media (prefers-reduced-motion:reduce){.egm-top{animation:none}}' +
    '@media print{.egm-top{display:none}}';
  var st = d.createElement('style');
  st.textContent = css;
  d.head.appendChild(st);

  var b = d.getElementById('egm-top');
  if (!b) {
    b = d.createElement('button');
    b.id = 'egm-top';
    b.type = 'button';
    b.hidden = true;
    b.setAttribute('aria-label', 'Back to top');
    b.title = 'Back to top';
    d.body.appendChild(b);
  }
  b.className = 'egm-top';
  b.setAttribute('data-look', look);
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var queued = false;
  function update() {
    queued = false;
    b.hidden = (w.pageYOffset || d.documentElement.scrollTop) < Math.min(w.innerHeight, 400);
  }
  function queue() {
    if (!queued) { queued = true; w.requestAnimationFrame(update); }
  }
  w.addEventListener('scroll', queue, { passive: true });
  w.addEventListener('resize', queue);
  update();

  b.addEventListener('click', function () {
    var calm = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
    w.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
    // keep keyboard focus at the top of the page, since the button hides itself there
    var t = d.getElementById('top') || d.body;
    t.setAttribute('tabindex', '-1');
    t.setAttribute('data-egm-top', '');
    t.focus({ preventScroll: true });
  });
})();
