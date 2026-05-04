// EGM Downloader - macOS Theme Toggle
// CSP-compliant (no inline handlers)

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('egmac-theme') || 'light';
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        toggleBtn.textContent = '☀️ Light';
    } else {
        html.removeAttribute('data-theme');
        toggleBtn.textContent = '🌙 Dark';
    }
    
    // Toggle theme
    toggleBtn.addEventListener('click', function() {
        const isDark = html.hasAttribute('data-theme');
        
        if (isDark) {
            html.removeAttribute('data-theme');
            toggleBtn.textContent = '🌙 Dark';
            localStorage.setItem('egmac-theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            toggleBtn.textContent = '☀️ Light';
            localStorage.setItem('egmac-theme', 'dark');
        }
    });
});
