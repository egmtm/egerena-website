/* Games Index — index.js */
/* Theme switcher, mute toggle, easter eggs */

(function() {
    'use strict';

    // ── Constants ──
    var THEMES = ['green', 'amber', 'ice', 'white'];
    var THEME_KEY = 'egm_games_theme';
    var MUTE_KEY = 'egm_games_muted';
    var VISITED_KEY = 'egm_games_visited';

    // ── Theme Switcher ──
    var html = document.documentElement;
    var switcher = document.getElementById('themeSwitcher');
    var trigger = document.getElementById('themeTrigger');
    var dropdown = document.getElementById('themeDropdown');
    var dotEl = document.getElementById('themeDot');
    var nameEl = document.getElementById('themeName');

    var currentTheme = localStorage.getItem(THEME_KEY) || 'green';
    if (THEMES.indexOf(currentTheme) === -1) currentTheme = 'green';

    function applyTheme(theme) {
        currentTheme = theme;
        html.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        nameEl.textContent = theme;

        // Update dropdown checkmarks
        var opts = document.querySelectorAll('[data-theme]');
        for (var i = 0; i < opts.length; i++) {
            var el = opts[i];
            if (el.classList.contains('theme-option')) {
                if (el.getAttribute('data-theme') === theme) {
                    el.classList.add('selected');
                } else {
                    el.classList.remove('selected');
                }
            }
        }
    }

    applyTheme(currentTheme);

    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = switcher.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen);
    });

    dropdown.addEventListener('click', function(e) {
        var opt = e.target.closest('[data-theme]');
        if (opt && opt.classList.contains('theme-option')) {
            applyTheme(opt.getAttribute('data-theme'));
            switcher.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('click', function() {
        switcher.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && switcher.classList.contains('open')) {
            switcher.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }
    });

    // ── Mute Toggle ──
    var muteBtn = document.getElementById('muteBtn');
    var isMuted = localStorage.getItem(MUTE_KEY) === '1';

    function updateMuteUI() {
        if (isMuted) {
            muteBtn.classList.add('muted');
            muteBtn.title = 'Hover sounds muted';
        } else {
            muteBtn.classList.remove('muted');
            muteBtn.title = 'Toggle hover sounds';
        }
    }

    updateMuteUI();

    muteBtn.addEventListener('click', function() {
        isMuted = !isMuted;
        localStorage.setItem(MUTE_KEY, isMuted ? '1' : '0');
        updateMuteUI();
    });

    // ── Easter Egg 2: Hover Blip Sound ──
    var audioCtx = null;
    var userHasInteracted = false;

    document.addEventListener('click', function() { userHasInteracted = true; });
    document.addEventListener('keydown', function() { userHasInteracted = true; });

    function blip(freq, duration) {
        freq = freq || 800;
        duration = duration || 0.04;
        if (!userHasInteracted || isMuted) return;
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch(e) { return; }
        }
        var osc = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.015, audioCtx.currentTime + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.start();
        osc.stop(audioCtx.currentTime + duration + 0.02);
    }

    // Only attach hover blip on devices that support hover
    if (window.matchMedia('(hover: hover)').matches) {
        var cards = document.querySelectorAll('.folder-card');
        for (var c = 0; c < cards.length; c++) {
            (function(card) {
                card.addEventListener('mouseenter', function() {
                    blip(card.classList.contains('locked') ? 220 : 700);
                });
            })(cards[c]);
        }
    }

    // ── Easter Egg 3: Visited State ──
    var visited = [];
    try { visited = JSON.parse(localStorage.getItem(VISITED_KEY) || '[]'); } catch(e) { visited = []; }

    var activeCards = document.querySelectorAll('.folder-card.active');
    for (var v = 0; v < activeCards.length; v++) {
        (function(card) {
            var game = card.getAttribute('data-game');
            if (visited.indexOf(game) !== -1) {
                var tag = document.createElement('span');
                tag.className = 'visited-tag';
                tag.textContent = '[visited]';
                card.appendChild(tag);
            }
            var link = card.closest('a');
            if (link) {
                link.addEventListener('click', function() {
                    if (visited.indexOf(game) === -1) {
                        visited.push(game);
                        localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
                    }
                });
            }
        })(activeCards[v]);
    }

    // ── Easter Egg 1: Konami Code ──
    var KONAMI = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
    var buffer = [];
    var konamiMsg = document.getElementById('konamiMsg');

    document.addEventListener('keydown', function(e) {
        buffer.push(e.key.toLowerCase());
        if (buffer.length > KONAMI.length) buffer.shift();
        var match = true;
        for (var k = 0; k < KONAMI.length; k++) {
            if (KONAMI[k] !== buffer[k]) { match = false; break; }
        }
        if (match && !sessionStorage.getItem('egm_konami')) {
            sessionStorage.setItem('egm_konami', '1');
            // Glitch effect
            document.body.style.opacity = '0.3';
            setTimeout(function() { document.body.style.opacity = '1'; }, 80);
            setTimeout(function() { document.body.style.opacity = '0.5'; }, 160);
            setTimeout(function() { document.body.style.opacity = '1'; }, 240);
            // Show message
            konamiMsg.style.display = 'block';
            setTimeout(function() { konamiMsg.style.display = 'none'; }, 2000);
            console.log('[stderr] konami sequence detected');
        }
    });

})();
