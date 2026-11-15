const canvas = document.getElementById('matrixRain');

if (canvas) {
    const ctx = canvas.getContext('2d');

    function setCanvasSize() {
        // Canvas is position:fixed — always match the viewport, never document height
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    setCanvasSize();

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');
    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = [];

    function initializeDrops() {
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
        }
    }

    initializeDrops();

    function getTerminalColor() {
        return getComputedStyle(document.documentElement).getPropertyValue('--terminal-color').trim() || '#00ff41';
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getTerminalColor();
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    let timer = null;
    function startRain() { if (!timer) timer = setInterval(draw, 50); }
    function stopRain() { clearInterval(timer); timer = null; }

    // With reduce motion on, the rain starts paused. The button in the navigation lets anyone pause or start it.
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) startRain();

    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('matrixToggle');
        if (!btn) return;
        const sync = () => btn.setAttribute('aria-pressed', timer ? 'false' : 'true');
        sync();
        btn.addEventListener('click', () => { if (timer) stopRain(); else startRain(); sync(); });
    });

    window.addEventListener('resize', () => {
        setCanvasSize();
        initializeDrops();
    });

    window.updateMatrixColor = function() {};
}
