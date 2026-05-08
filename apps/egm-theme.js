(function() {
    var body  = document.body;
    var btn   = document.getElementById('themeToggle');
    var THEMES = ['commander', 'azure', 'win95', 'aero'];
    var CLASSES = { azure: 'theme-azure', win95: 'theme-win95', aero: 'theme-aero' };

    var saved = localStorage.getItem('egmWinTheme') || 'commander';
    if (!THEMES.includes(saved)) saved = 'commander';

    function applyTheme(t) {
        body.classList.remove('theme-azure', 'theme-win95', 'theme-aero');
        if (CLASSES[t]) body.classList.add(CLASSES[t]);
        localStorage.setItem('egmWinTheme', t);
    }

    applyTheme(saved);

    if (btn) {
        btn.addEventListener('click', function() {
            var current = localStorage.getItem('egmWinTheme') || 'commander';
            var idx     = THEMES.indexOf(current);
            var next    = THEMES[(idx + 1) % THEMES.length];
            applyTheme(next);
        });
    }
})();
