(function() {
    var body = document.body;
    var btn  = document.getElementById('themeToggle');

    if (localStorage.getItem('egmWinTheme') === 'azure') {
        body.classList.add('theme-azure');
    }

    if (btn) {
        btn.addEventListener('click', function() {
            body.classList.toggle('theme-azure');
            localStorage.setItem('egmWinTheme',
                body.classList.contains('theme-azure') ? 'azure' : 'commander');
        });
    }
})();
