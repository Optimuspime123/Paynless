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
    });

    // --- AI SIDEBAR TOGGLE ---
    const appContainer = document.querySelector('.app-container');
    const aiToggle = document.getElementById('aiToggle');
    const aiClose = document.getElementById('aiClose');
    const sidebarRight = document.querySelector('.sidebar-right');
    const body = document.body;
    const aiToggleLabel = aiToggle ? aiToggle.querySelector('span') : null;
    const mobileQuery = window.matchMedia('(max-width: 1024px)');

    const setAISidebarState = (isOpen) => {
        if (!appContainer || !sidebarRight || !aiToggle) return;

        appContainer.classList.toggle('ai-collapsed', !isOpen);
        sidebarRight.setAttribute('aria-hidden', String(!isOpen));
        aiToggle.setAttribute('aria-expanded', String(isOpen));
        aiToggle.classList.toggle('is-active', isOpen);
        aiToggle.setAttribute('aria-label', isOpen ? 'Close AI Assistant' : 'Open AI Assistant');

        if (aiToggleLabel) {
            aiToggleLabel.textContent = isOpen ? 'Hide AI' : 'Paynless AI';
        }

        const isMobile = mobileQuery.matches;
        body.classList.toggle('ai-panel-active', isOpen && isMobile);
    };

    const isMobile = mobileQuery.matches;
    setAISidebarState(!isMobile);

    if (aiToggle) {
        aiToggle.addEventListener('click', () => {
            const isCurrentlyOpen = !appContainer.classList.contains('ai-collapsed');
            setAISidebarState(!isCurrentlyOpen);
        });
    }

    if (aiClose) {
        aiClose.addEventListener('click', () => {
            setAISidebarState(false);
        });
    }

    const handleViewportChange = () => {
        const isMobileViewport = mobileQuery.matches;
        const isCollapsed = appContainer.classList.contains('ai-collapsed');

        if (isMobileViewport) {
            if (!isCollapsed) {
                body.classList.add('ai-panel-active');
            } else {
                body.classList.remove('ai-panel-active');
            }
        } else {
            body.classList.remove('ai-panel-active');

            if (isCollapsed) {
                setAISidebarState(true);
            }
        }
    };

    if (typeof mobileQuery.addEventListener === 'function') {
        mobileQuery.addEventListener('change', handleViewportChange);
    } else if (typeof mobileQuery.addListener === 'function') {
        mobileQuery.addListener(handleViewportChange);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setAISidebarState(false);
        }
    });

    document.addEventListener('click', (event) => {
        if (body.classList.contains('ai-panel-active')) {
            const clickInsidePanel = sidebarRight.contains(event.target);
            const clickOnToggle = aiToggle && aiToggle.contains(event.target);

            if (!clickInsidePanel && !clickOnToggle) {
                setAISidebarState(false);
            }
        }
    });

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

    // --- TRANSACTION HISTORY ---
    const transactionData = [
        { name: 'Salary Deposit', date: 'Nov 25', amount: 85000, type: 'income', icon: 'ph-bank' },
        { name: 'Rent Payment', date: 'Nov 24', amount: -25000, type: 'expense', icon: 'ph-house' },
        { name: 'Freelance Project', date: 'Nov 23', amount: 15000, type: 'income', icon: 'ph-code' },
        { name: 'Groceries', date: 'Nov 22', amount: -2500, type: 'expense', icon: 'ph-shopping-cart' },
        { name: 'Investment Return', date: 'Nov 21', amount: 8500, type: 'income', icon: 'ph-chart-line-up' },
        { name: 'Internet Bill', date: 'Nov 20', amount: -1200, type: 'expense', icon: 'ph-wifi-high' },
        { name: 'Client Payment', date: 'Nov 19', amount: 12000, type: 'income', icon: 'ph-money' },
        { name: 'Electricity', date: 'Nov 18', amount: -890, type: 'expense', icon: 'ph-lightning' }
    ];

    const transactionList = document.getElementById('transactionList');

    function renderTransactions() {
        transactionList.innerHTML = '';
        transactionData.forEach(tx => {
            const item = document.createElement('div');
            item.className = 'transaction-item';

            const amountPrefix = tx.amount > 0 ? '+' : '';
            const amountFormatted = `${amountPrefix}₹${Math.abs(tx.amount).toLocaleString('en-IN')}`;

            item.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-icon ${tx.type}">
                        <i class="ph ${tx.icon}"></i>
                    </div>
                    <div class="transaction-details">
                        <div class="transaction-name">${tx.name}</div>
                        <div class="transaction-date">${tx.date}</div>
                    </div>
                </div>
                <div class="transaction-amount ${tx.type}">${amountFormatted}</div>
            `;
            transactionList.appendChild(item);
        });
    }

    // --- TOGGLE AMOUNTS VISIBILITY ---
    const toggleAmountsBtn = document.getElementById('toggleAmounts');
    const toggleIcon = toggleAmountsBtn.querySelector('i');
    let amountsVisible = true;

    toggleAmountsBtn.addEventListener('click', () => {
        amountsVisible = !amountsVisible;

        // Toggle icon and tooltip
        if (amountsVisible) {
            toggleIcon.classList.remove('ph-eye-slash');
            toggleIcon.classList.add('ph-eye');
            toggleAmountsBtn.title = 'Hide amounts';
        } else {
            toggleIcon.classList.remove('ph-eye');
            toggleIcon.classList.add('ph-eye-slash');
            toggleAmountsBtn.title = 'Show amounts';
        }

        // Toggle wallet amounts
        const balance = document.querySelector('.balance');
        const walletValues = document.querySelectorAll('.wallet-stats .value');
        balance.classList.toggle('hidden', !amountsVisible);
        walletValues.forEach(val => val.classList.toggle('hidden', !amountsVisible));

        // Toggle transaction amounts
        const transactionAmounts = document.querySelectorAll('.transaction-amount');
        transactionAmounts.forEach(amt => amt.classList.toggle('hidden', !amountsVisible));
    });

    // --- MATRIX RAIN ANIMATION ---
    const matrixCard = document.getElementById('matrixCard');
    const matrixCanvas = document.getElementById('matrixCanvas');
    let animationTimeout;
    let cleanupTimer;
    let isAnimating = false;

    // Configuration
    const DURATION = 1100;
    const FADE_DURATION = 350;
    const DROP_COUNT = 45;
    const CHARS = ['₹', '₹', '₹', '₹', '0', '1', '1', '0'];

    function startMatrix() {
        // Clear any pending fade-out
        clearTimeout(animationTimeout);
        clearTimeout(cleanupTimer);

        // If we're fading out, cancel it and continue
        matrixCanvas.classList.remove('fading-out');

        // Only generate new drops if we're not already animating
        if (!isAnimating) {
            matrixCanvas.innerHTML = '';

            for (let i = 0; i < DROP_COUNT; i++) {
                const drop = document.createElement('div');
                drop.className = 'matrix-drop';
                drop.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];

                drop.style.left = Math.random() * 100 + '%';
                drop.style.animationDuration = (1 + Math.random() * 1.5) + 's';
                drop.style.animationDelay = Math.random() * 1.5 + 's';
                drop.style.fontSize = (10 + Math.random() * 6) + 'px';

                matrixCanvas.appendChild(drop);
            }

            isAnimating = true;
        }

        // Set auto-stop timer
        animationTimeout = setTimeout(() => {
            fadeOutMatrix();
        }, DURATION);
    }

    function fadeOutMatrix() {
        // Add fade-out class for smooth transition
        matrixCanvas.classList.add('fading-out');

        // Clean up after fade completes
        cleanupTimer = setTimeout(() => {
            matrixCanvas.innerHTML = '';
            matrixCanvas.classList.remove('fading-out');
            isAnimating = false;
        }, FADE_DURATION);
    }

    function stopMatrix() {
        clearTimeout(animationTimeout);
        clearTimeout(cleanupTimer);

        if (isAnimating) {
            fadeOutMatrix();
        }
    }

    // Event Listeners for Matrix Animation
    matrixCard.addEventListener('mouseenter', startMatrix);
    matrixCard.addEventListener('mouseleave', stopMatrix);

    // --- SUBSCRIPTIONS SECTION ---
    const subscriptionsData = [
        {
            name: 'Discord Nitro',
            status: 'active',
            price: '₹649',
            logo: 'https://assets.codepen.io/605876/discord.png',
            manageUrl: 'https://discord.com/settings/subscriptions'
        },
        {
            name: 'Claude Pro',
            status: 'active',
            price: '₹1,650',
            logo: 'https://techshark.io/media/tool_logo/Claude_AI_Logo.png',
            manageUrl: 'https://claude.ai/settings/billing'
        },
        {
            name: 'Telegram Premium',
            status: 'active',
            price: '₹469',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/2048px-Telegram_2019_Logo.svg.png',
            manageUrl: 'https://telegram.org/'
        },
        {
            name: 'Netflix Basic',
            status: 'active',
            price: '₹199',
            logo: 'https://static.vecteezy.com/system/resources/previews/017/396/814/non_2x/netflix-mobile-application-logo-free-png.png',
            manageUrl: 'https://www.netflix.com/youraccount'
        },
        {
            name: 'Spotify Premium',
            status: 'trial',
            price: '₹119',
            logo: 'https://assets.codepen.io/605876/spotify.png',
            manageUrl: 'https://www.spotify.com/account/subscription/'
        },
        {
            name: 'Disney+',
            status: 'expired',
            price: '₹299',
            logo: 'https://logo.wine/a/logo/Disney%2B/Disney%2B-White-Dark-Background-Logo.wine.svg',
            manageUrl: 'https://www.hotstar.com/settings'
        }
    ];

    const subscriptionsGrid = document.getElementById('subscriptionsGrid');

    function renderSubscriptions() {
        subscriptionsGrid.innerHTML = '';

        subscriptionsData.forEach((sub, index) => {
            const card = document.createElement('article');
            card.className = 'subscription-card';
            card.dataset.index = index;

            const statusClass = sub.status;
            const statusLabel = sub.status.charAt(0).toUpperCase() + sub.status.slice(1);

            card.innerHTML = `
                <div>
                    <div class="menu-wrapper">
                        <button class="menu-btn" aria-label="Manage subscription" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
                            </svg>
                        </button>
                        <div class="subscription-menu" data-index="${index}">
                            <button class="menu-item" data-url="${sub.manageUrl}">
                                <i class="ph ph-gear"></i>
                                Manage Plan
                            </button>
                        </div>
                    </div>
                    <div class="img-container">
                        <img src="${sub.logo}" alt="" />
                    </div>
                    <img src="${sub.logo}" alt="${sub.name} logo" />
                    <h3>${sub.name}</h3>
                    <div class="subscription-price font-mono">${sub.price}/mo</div>
                    <span class="subscription-status ${statusClass}">${statusLabel}</span>
                </div>
            `;

            subscriptionsGrid.appendChild(card);
        });

        const menuBtns = document.querySelectorAll('.menu-btn');
        const menus = document.querySelectorAll('.subscription-menu');

        menuBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = btn.dataset.index;
                const menu = document.querySelector(`.subscription-menu[data-index="${index}"]`);

                menus.forEach(m => {
                    if (m !== menu) m.classList.remove('active');
                });

                menu.classList.toggle('active');
            });
        });

        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = item.dataset.url;
                window.open(url, '_blank');
                menus.forEach(m => m.classList.remove('active'));
            });
        });

        document.addEventListener('click', () => {
            menus.forEach(m => m.classList.remove('active'));
        });
    }

    document.addEventListener('pointermove', (event) => {
        const subCards = document.querySelectorAll('.subscription-card');
        subCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const relativeX = event.clientX - centerX;
            const relativeY = event.clientY - centerY;

            const x = relativeX / (rect.width / 2);
            const y = relativeY / (rect.height / 2);

            card.style.setProperty('--pointer-x', x.toFixed(3));
            card.style.setProperty('--pointer-y', y.toFixed(3));
        });
    });

    // Initial Render
    renderPortfolio('crypto');
    renderTransactions();
    renderSubscriptions();
});
