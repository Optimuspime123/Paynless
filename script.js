document.addEventListener('DOMContentLoaded', () => {
    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // Check local storage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('ph-sun');
            themeIcon.classList.add('ph-moon');
        } else {
            themeIcon.classList.remove('ph-moon');
            themeIcon.classList.add('ph-sun');
        }
    }

    // --- PORTFOLIO SWITCHER ---
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const portfolioList = document.getElementById('portfolioList');

    const portfolioData = {
        crypto: [
            { name: 'Bitcoin', sub: 'BTC', price: '$94,230.50', change: '+2.4%', isPos: true, icon: 'ph-currency-btc', color: '#ccff00' },
            { name: 'Ethereum', sub: 'ETH', price: '$4,120.10', change: '+1.8%', isPos: true, icon: 'ph-currency-eth', color: '#ccff00' },
            { name: 'Solana', sub: 'SOL', price: '$145.20', change: '-5.2%', isPos: false, icon: 'ph-currency-solana', color: '#ff4d00' }
        ],
        fiat: [
            { name: 'Apple Inc.', sub: 'AAPL', price: '$182.50', change: '+0.5%', isPos: true, icon: 'ph-apple-logo', color: '#ccff00' },
            { name: 'Tesla', sub: 'TSLA', price: '$240.10', change: '-1.2%', isPos: false, icon: 'ph-car', color: '#ff4d00' },
            { name: 'NVIDIA', sub: 'NVDA', price: '$485.90', change: '+3.1%', isPos: true, icon: 'ph-chip', color: '#ccff00' }
        ]
    };

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content
            const type = btn.getAttribute('data-type');
            renderPortfolio(type);
        });
    });

    function renderPortfolio(type) {
        const data = portfolioData[type];
        portfolioList.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('div');
            row.className = 'asset-row';

            // Simple SVG graph path generation based on positive/negative
            const graphColor = item.isPos ? 'var(--primary)' : 'var(--negative)';
            const graphPath = item.isPos
                ? 'M0,25 Q25,25 50,10 T100,5' // Upward trend
                : 'M0,10 Q25,25 50,15 T100,28'; // Downward trend

            row.innerHTML = `
                <div class="asset-info">
                    <div class="asset-icon"><i class="ph-fill ${item.icon}"></i></div>
                    <div>
                        <div class="asset-name">${item.name}</div>
                        <div class="asset-sub">${item.sub}</div>
                    </div>
                </div>
                <div class="asset-graph">
                    <svg width="100" height="30" viewBox="0 0 100 30">
                        <path d="${graphPath}" fill="none" stroke="${graphColor}" stroke-width="2"/>
                    </svg>
                </div>
                <div class="asset-values">
                    <div class="asset-price font-mono">${item.price}</div>
                    <div class="asset-change ${item.isPos ? 'positive' : 'negative'} font-mono">${item.change}</div>
                </div>
            `;
            portfolioList.appendChild(row);
        });
    }

    // --- CHAT INTERFACE ---
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatWindow = document.getElementById('chatWindow');

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user' : 'ai'}`;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        msgDiv.innerHTML = `
            <p>${text}</p>
            <span class="time">${time}</span>
        `;

        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        chatInput.value = '';

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "I've updated your budget based on that.",
                "Analyzing the market trends for you...",
                "That sounds like a good financial move.",
                "I've noted that expense in your ledger.",
                "Would you like to see a breakdown of that?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, false);
        }, 1000);
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Initial Render
    renderPortfolio('crypto');
});
