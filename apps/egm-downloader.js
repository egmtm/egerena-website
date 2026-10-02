/* EGM Downloader landing page: theme picker, OS aware download button, subscriptions demo.
   Loaded in the head so the saved or system theme is applied before first paint. */
(function () {
  'use strict';
  var THEMES = [
  {name:"Ghost",dark:true,bg:"#0d1117",surf:"#161b22",surf2:"#1c2128",fg:"#e6edf3",mut:"#8b949e",line:"#30363d",acc:"#238636",accT:"#3fb950",acc2:"#3fb950",on:"#ffffff",on2:"#000000",red:"#f85149",yel:"#d29922"},
  {name:"Porcelain",dark:false,bg:"#f4f4f8",surf:"#ececf4",surf2:"#e4e4ee",fg:"#0c1020",mut:"#4060a0",line:"#b8b8cc",acc:"#3858a8",accT:"#3858a8",acc2:"#4868b8",on:"#ffffff",on2:"#ffffff",red:"#883040",yel:"#706830"},
  {name:"Eclipse",dark:true,bg:"#18161a",surf:"#241f28",surf2:"#2e2535",fg:"#e2daea",mut:"#988dab",line:"#3a3040",acc:"#a855f7",accT:"#c084fc",acc2:"#c084fc",on:"#000000",on2:"#000000",red:"#f87171",yel:"#fbbf24"},
  {name:"La Parguera",dark:true,bg:"#020810",surf:"#030e1a",surf2:"#041424",fg:"#c0f0e8",mut:"#28a090",line:"#083040",acc:"#00d8c0",accT:"#00d8c0",acc2:"#20e8d0",on:"#000000",on2:"#000000",red:"#e04060",yel:"#80e040"},
  {name:"Bone",dark:false,bg:"#f5f0e8",surf:"#ede7d9",surf2:"#e4ddd0",fg:"#1e1810",mut:"#5a4e3a",line:"#c8bfaa",acc:"#2563eb",accT:"#2457c9",acc2:"#3b82f6",on:"#ffffff",on2:"#000000",red:"#b91c1c",yel:"#b45309"},
  {name:"Wildfire",dark:true,bg:"#100600",surf:"#1c0a00",surf2:"#271000",fg:"#ffe0cc",mut:"#c07040",line:"#5a2000",acc:"#f4511e",accT:"#f4511e",acc2:"#ff7043",on:"#000000",on2:"#000000",red:"#ff1744",yel:"#ffca28"},
  {name:"Vaporwave",dark:true,bg:"#1a0030",surf:"#260040",surf2:"#320050",fg:"#fffb96",mut:"#e088e0",line:"#700090",acc:"#ff71ce",accT:"#ff71ce",acc2:"#ff99dd",on:"#000000",on2:"#000000",red:"#ff71ce",yel:"#fffb96"}
  ];
  var VARS = ['bg', 'surf', 'surf2', 'fg', 'mut', 'line', 'acc', 'accT', 'acc2', 'on', 'on2', 'red', 'yel'];
  var KEY = 'egm-theme';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  var cur = 0;
  var manual = false;

  function sys() { return mq && mq.matches ? 1 : 0; } // Porcelain for light systems, Ghost otherwise

  function apply(i) {
    var t = THEMES[i];
    cur = i;
    for (var k = 0; k < VARS.length; k++) root.style.setProperty('--' + VARS[k], t[VARS[k]]);
    root.style.colorScheme = t.dark ? 'dark' : 'light';
    root.setAttribute('data-mode', t.dark ? 'dark' : 'light');
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t.bg);
  }

  // Early pass, before the body paints.
  var saved = -1;
  try {
    var name = localStorage.getItem(KEY);
    for (var s = 0; s < THEMES.length; s++) if (THEMES[s].name === name) saved = s;
  } catch (e) {}
  if (saved >= 0) { manual = true; apply(saved); } else { apply(sys()); }

  function detect() {
    var ua = (navigator.userAgent || '').toLowerCase();
    var pl = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '').toLowerCase();
    if (/android|iphone|ipad|ipod|cros/.test(ua) || (pl.indexOf('mac') === 0 && navigator.maxTouchPoints > 1)) return 'other';
    if (pl.indexOf('win') === 0) return 'win';
    if (pl.indexOf('mac') === 0 || ua.indexOf('mac os') >= 0) return 'mac';
    if (pl.indexOf('linux') === 0 || ua.indexOf('linux') >= 0 || ua.indexOf('x11') >= 0) return 'linux';
    return 'other';
  }

  function init() {
    var $ = function (sel) { return document.querySelector(sel); };
    var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

    // Download button follows the visitor's OS. Anything else (phones, tablets, unknown) jumps to the platform cards.
    var card = $('.plat[data-os="' + detect() + '"]');
    if (card) {
      card.classList.add('rec');
      var href = card.querySelector('.btn').getAttribute('href');
      $('#heroDl').setAttribute('href', href);
      $('#navDl').setAttribute('href', href);
      $('#heroDlText').textContent = 'Download for ' + card.getAttribute('data-name');
      $('#heroReq').textContent = card.getAttribute('data-short');
    }

    var swatches = $$('.sw');
    var nameEl = $('#themeName');
    var modeBtn = $('#modeBtn');

    function paint(animate) {
      swatches.forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-i') === cur ? 'true' : 'false'); });
      nameEl.textContent = THEMES[cur].name;
      modeBtn.setAttribute('aria-label', THEMES[cur].dark ? 'Switch to light mode' : 'Switch to dark mode');
      if (animate) { nameEl.classList.remove('pop'); void nameEl.offsetWidth; nameEl.classList.add('pop'); }
    }

    function choose(i) {
      manual = true;
      apply(i);
      paint(true);
      try { localStorage.setItem(KEY, THEMES[i].name); } catch (e) {}
    }

    swatches.forEach(function (b) { b.addEventListener('click', function () { choose(+b.getAttribute('data-i')); }); });
    modeBtn.addEventListener('click', function () { choose(THEMES[cur].dark ? 1 : 0); }); // quick switch: Porcelain or Ghost
    $('#surprise').addEventListener('click', function () {
      choose((cur + 1 + Math.floor(Math.random() * (THEMES.length - 1))) % THEMES.length);
    });
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function () { if (!manual) { apply(sys()); paint(true); } });
    }
    paint();

    // Subscriptions demo: switch between the sample channels and playlist.
    var items = $$('.subitem');
    var panes = $$('.pane');
    items.forEach(function (b) {
      b.addEventListener('click', function () {
        var i = b.getAttribute('data-i');
        items.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        panes.forEach(function (p) { p.hidden = p.getAttribute('data-i') !== i; });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
