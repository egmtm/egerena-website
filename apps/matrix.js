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

    setInterval(draw, 50);

    window.addEventListener('resize', () => {
        setCanvasSize();
        initializeDrops();
    });

    window.updateMatrixColor = function() {};
}
