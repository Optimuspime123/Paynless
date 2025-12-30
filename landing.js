document.addEventListener('DOMContentLoaded', () => {
    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check local storage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update matrix colors on theme change if needed
        if (window.updateMatrixColors) window.updateMatrixColors();
    });

    // --- MATRIX BACKGROUND EFFECT ---
    const canvas = document.getElementById('matrixBackground');
    const ctx = canvas.getContext('2d');

    let width, height, columns;
    const fontSize = 16;
    let drops = [];

    function initMatrix() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
    }

    function drawMatrix() {
        // Subtle trail effect
        ctx.fillStyle = html.getAttribute('data-theme') === 'dark'
            ? 'rgba(18, 18, 18, 0.05)'
            : 'rgba(240, 240, 240, 0.05)';
        ctx.fillRect(0, 0, width, height);

        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        ctx.fillStyle = primaryColor;
        ctx.font = fontSize + 'px "JetBrains Mono"';

        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(Math.random() * 128);
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    initMatrix();
    window.addEventListener('resize', initMatrix);

    function animateMatrix() {
        drawMatrix();
        requestAnimationFrame(animateMatrix);
    }
    animateMatrix();

    // --- WORD CAROUSEL ANIMATION ---
    const carousel = document.getElementById('wordCarousel');
    const words = carousel.querySelectorAll('.carousel-word');
    let currentIndex = 0;
    const WORD_DURATION = 2000;

    function rotateCarousel() {
        // Remove all classes first
        words.forEach(word => {
            word.classList.remove('active', 'exit');
        });

        // Set current word as active
        words[currentIndex].classList.add('active');
    }

    function nextWord() {
        const prevIndex = currentIndex;
        currentIndex = (currentIndex + 1) % words.length;

        // Exit current word
        words[prevIndex].classList.remove('active');
        words[prevIndex].classList.add('exit');

        // Enter next word with a tiny delay to ensure smooth transition start
        setTimeout(() => {
            words[currentIndex].classList.add('active');
        }, 50);

        // Cleanup: Reset the previous word after its exit animation completes
        setTimeout(() => {
            words[prevIndex].classList.remove('exit');
        }, 500);
    }

    // Initialize
    rotateCarousel();

    // Start the interval
    setInterval(nextWord, WORD_DURATION);


    // --- GET STARTED BUTTON ---
    const getStartedBtn = document.getElementById('getStarted');
    const pageTransition = document.getElementById('pageTransition');

    getStartedBtn.addEventListener('click', () => {
        getStartedBtn.classList.add('glitching');

        setTimeout(() => {
            pageTransition.classList.add('active');
            setTimeout(() => {
                window.location.href = 'dash.html';
            }, 1000);
        }, 400);
    });

    // --- MOUSE PARALLAX ---
    const heroContent = document.querySelector('.hero-content');
    const shapes = document.querySelectorAll('.floating-shape');

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        if (heroContent) {
            heroContent.style.transform = `translate(${moveX * 10}px, ${moveY * 10}px)`;
        }

        shapes.forEach((shape, index) => {
            const factor = (index + 1) * 15;
            shape.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px) rotate(${moveX * 10}deg)`;
        });
    });

    // --- TITLE GLITCH ---
    const heroTitle = document.querySelector('.hero-title');
    function triggerGlitch() {
        heroTitle.classList.add('glitch-active');
        setTimeout(() => {
            heroTitle.classList.remove('glitch-active');
        }, 300);
    }

    setInterval(() => {
        if (Math.random() > 0.85) triggerGlitch();
    }, 4000);
});
