// Theme Selector for Linux
const THEMES = {
    '#00ff41': { dim: '#00aa2b', hover: 'rgba(0, 255, 65, 0.05)' },
    '#ffb000': { dim: '#cc8800', hover: 'rgba(255, 176, 0, 0.05)' },
    '#00d9ff': { dim: '#0099bb', hover: 'rgba(0, 217, 255, 0.05)' },
    '#c084fc': { dim: '#9055cc', hover: 'rgba(192, 132, 252, 0.05)' },
    '#ff4444': { dim: '#cc2222', hover: 'rgba(255, 68, 68, 0.05)' }
};

document.addEventListener('DOMContentLoaded', function() {
    const themeSelector = document.getElementById('themeSelector');
    const root = document.documentElement;

    // Load saved theme
    const savedColor = localStorage.getItem('terminalColor') || '#00ff41';
    themeSelector.value = savedColor;
    applyColor(savedColor);

    // Handle theme change
    themeSelector.addEventListener('change', function() {
        applyColor(this.value);
        localStorage.setItem('terminalColor', this.value);
    });

    function applyColor(color) {
        const theme = THEMES[color] || THEMES['#00ff41'];
        root.style.setProperty('--terminal-color', color);
        root.style.setProperty('--terminal-dim', theme.dim);
        root.style.setProperty('--terminal-hover', theme.hover);
        if (window.updateMatrixColor) window.updateMatrixColor(color);
    }
});
