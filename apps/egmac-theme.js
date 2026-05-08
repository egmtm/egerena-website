document.addEventListener('DOMContentLoaded', function() {
    var btn    = document.querySelector('.theme-toggle');
    var html   = document.documentElement;
    var THEMES = ['light', 'dark', 'aqua', 'platinum'];
    var ICONS  = { light: '☀️', dark: '🌙', aqua: '💧', platinum: '◈' };

    var saved = localStorage.getItem('egmac-theme') || 'light';
    if (!THEMES.includes(saved)) saved = 'light';

    function applyTheme(t) {
        if (t === 'light') {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', t);
        }
        if (btn) btn.textContent = ICONS[t] || '☀️';
        localStorage.setItem('egmac-theme', t);
    }

    applyTheme(saved);

    if (btn) {
        btn.addEventListener('click', function() {
            var current = localStorage.getItem('egmac-theme') || 'light';
            var idx     = THEMES.indexOf(current);
            var next    = THEMES[(idx + 1) % THEMES.length];
            applyTheme(next);
        });
    }
});
