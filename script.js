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
            // Only toggle if the state is actually different to avoid thrashing
            const shouldBeActive = !isCollapsed;
            if (body.classList.contains('ai-panel-active') !== shouldBeActive) {
                body.classList.toggle('ai-panel-active', shouldBeActive);
            }
        } else {
            if (body.classList.contains('ai-panel-active')) {
                body.classList.remove('ai-panel-active');
            }

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
            {
                name: 'Bitcoin',
                sub: 'BTC',
                price: '$94,230.50',
                change: '+2.4%',
                isPos: true,
                icon: 'ph-currency-btc',
                color: '#ccff00',
                currency: 'USD',
                series: {
                    week: [91800, 92350, 91750, 93100, 94200, 93950, 94800, 95250],
                    month: [90200, 91400, 89900, 92750, 93200, 91850, 93500, 94750, 93600, 95400, 96250, 95250],
                    year: [61200, 64800, 62500, 70150, 68600, 74300, 78200, 75900, 82500, 84200, 88100, 91400, 89900, 92750, 96250, 94400, 97100, 95250]
                }
            },
            {
                name: 'Ethereum',
                sub: 'ETH',
                price: '$4,120.10',
                change: '+1.8%',
                isPos: true,
                icon: 'ph-currency-eth',
                color: '#ccff00',
                currency: 'USD',
                series: {
                    week: [3950, 4010, 3980, 4085, 4140, 4115, 4180, 4220],
                    month: [3720, 3860, 3810, 3925, 4010, 3975, 4050, 4160, 4090, 4210, 4280, 4220],
                    year: [2150, 2380, 2210, 2650, 2890, 3050, 3340, 3180, 3510, 3720, 3860, 3810, 4020, 4160, 4280, 4120, 4350, 4220]
                }
            },
            {
                name: 'Solana',
                sub: 'SOL',
                price: '$145.20',
                change: '-5.2%',
                isPos: false,
                iconSvg: `
                    <svg viewBox="0 0 256 256" aria-hidden="true" focusable="false">
                        <defs>
                            <linearGradient id="solanaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#00ffa3" />
                                <stop offset="100%" stop-color="#dc1fff" />
                            </linearGradient>
                        </defs>
                        <g fill="url(#solanaGrad)">
                            <path d="M44 54c4-4 9-6 14-6h144c3 0 4 4 2 6l-20 20c-4 4-9 6-14 6H26c-3 0-4-4-2-6l20-20z"/>
                            <path d="M212 112c4-4 2-10-3-10H65c-5 0-10 2-14 6l-20 20c-4 4-2 10 3 10h144c5 0 10-2 14-6l20-20z"/>
                            <path d="M44 170c4-4 9-6 14-6h144c3 0 4 4 2 6l-20 20c-4 4-9 6-14 6H26c-3 0-4-4-2-6l20-20z"/>
                        </g>
                    </svg>
                `,
                color: '#ff4d00',
                currency: 'USD',
                series: {
                    week: [162, 158, 155, 149, 152, 147, 144, 145],
                    month: [176, 168, 171, 165, 158, 154, 150, 155, 149, 147, 143, 145],
                    year: [98, 112, 106, 124, 136, 151, 172, 165, 158, 170, 176, 168, 160, 154, 149, 147, 142, 145]
                }
            }
        ],
        fiat: [
            {
                name: 'Apple Inc.',
                sub: 'AAPL',
                price: '$182.50',
                change: '+0.5%',
                isPos: true,
                icon: 'ph-apple-logo',
                color: '#ccff00',
                currency: 'USD',
                series: {
                    week: [178.4, 179.1, 177.9, 180.2, 181.6, 180.8, 182.1, 182.5],
                    month: [171.5, 173.2, 170.8, 175.1, 176.4, 174.9, 178.3, 179.6, 177.2, 180.5, 183.2, 182.5],
                    year: [142.2, 151.8, 149.4, 158.6, 165.3, 172.1, 168.4, 176.3, 181.4, 174.2, 179.5, 171.5, 178.3, 183.2, 186.5, 179.2, 184.8, 182.5]
                }
            },
            {
                name: 'Tesla',
                sub: 'TSLA',
                price: '$240.10',
                change: '-1.2%',
                isPos: false,
                icon: 'ph-car',
                color: '#ff4d00',
                currency: 'USD',
                series: {
                    week: [258, 252, 248, 244, 246, 242, 239, 240.1],
                    month: [272, 266, 260, 255, 248, 244, 239, 245, 241, 238, 236, 240.1],
                    year: [312, 298, 286, 272, 255, 268, 284, 271, 256, 244, 236, 248, 242, 239, 232, 236, 228, 240.1]
                }
            },
            {
                name: 'NVIDIA',
                sub: 'NVDA',
                price: '$485.90',
                change: '+3.1%',
                isPos: true,
                iconSvg: `
                    <svg viewBox="0 0 256 256" aria-hidden="true" focusable="false">
                        <g fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M40 128c40-60 120-60 160 0-40 60-120 60-160 0z"/>
                            <circle cx="128" cy="128" r="28" fill="currentColor"/>
                        </g>
                    </svg>
                `,
                color: '#ccff00',
                currency: 'USD',
                series: {
                    week: [462, 468, 471, 478, 482, 479, 486, 485.9],
                    month: [438, 452, 445, 462, 474, 468, 479, 492, 486, 498, 502, 485.9],
                    year: [310, 338, 352, 371, 388, 412, 436, 421, 456, 469, 438, 452, 479, 502, 528, 512, 498, 485.9]
                }
            }
        ]
    };

    const chartSizing = {
        spark: { width: 120, height: 40, padding: 4 },
        detail: { width: 320, height: 120, padding: 10 }
    };

    const formatCurrency = (value, currency) => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: value < 1000 ? 2 : 0
        });
        return formatter.format(value);
    };

    const buildChartPaths = (series, width, height, padding) => {
        const min = Math.min(...series);
        const max = Math.max(...series);
        const range = max - min || 1;
        const step = (width - padding * 2) / (series.length - 1);

        const points = series.map((value, index) => {
            const x = padding + index * step;
            const y = height - padding - ((value - min) / range) * (height - padding * 2);
            return { x, y };
        });

        const line = points
            .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
            .join(' ');

        const area = [
            `M${points[0].x.toFixed(2)},${(height - padding).toFixed(2)}`,
            `L${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`,
            ...points.slice(1).map(point => `L${point.x.toFixed(2)},${point.y.toFixed(2)}`),
            `L${points[points.length - 1].x.toFixed(2)},${(height - padding).toFixed(2)}`,
            'Z'
        ].join(' ');

        return { line, area };
    };

    const getSeriesStats = (series) => {
        const min = Math.min(...series);
        const max = Math.max(...series);
        const start = series[0];
        const end = series[series.length - 1];
        const change = ((end - start) / start) * 100;
        return { min, max, end, change };
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

            const sparkSeries = item.series.week;
            const sparkPaths = buildChartPaths(sparkSeries, chartSizing.spark.width, chartSizing.spark.height, chartSizing.spark.padding);
            const detailPaths = buildChartPaths(item.series.month, chartSizing.detail.width, chartSizing.detail.height, chartSizing.detail.padding);
            const sparkId = `spark-${type}-${item.sub}`;
            const detailId = `detail-${type}-${item.sub}`;
            const detailStats = getSeriesStats(item.series.month);

            row.style.setProperty('--chart-color', item.color);

            const iconMarkup = item.iconSvg
                ? item.iconSvg
                : `<i class="ph-fill ${item.icon}"></i>`;

            row.innerHTML = `
                <div class="asset-info">
                    <div class="asset-icon">${iconMarkup}</div>
                    <div>
                        <div class="asset-name">${item.name}</div>
                        <div class="asset-sub">${item.sub}</div>
                    </div>
                </div>
                <div class="asset-graph">
                    <svg viewBox="0 0 ${chartSizing.spark.width} ${chartSizing.spark.height}" preserveAspectRatio="none" class="sparkline">
                        <defs>
                            <linearGradient id="${sparkId}" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="var(--chart-color)" stop-opacity="0.45" />
                                <stop offset="100%" stop-color="var(--chart-color)" stop-opacity="0" />
                            </linearGradient>
                        </defs>
                        <path class="sparkline-area" d="${sparkPaths.area}" fill="url(#${sparkId})"></path>
                        <path class="sparkline-line" d="${sparkPaths.line}"></path>
                    </svg>
                </div>
                <div class="asset-values">
                    <div class="asset-price font-mono">${item.price}</div>
                    <div class="asset-change ${item.isPos ? 'positive' : 'negative'} font-mono">${item.change}</div>
                </div>
                <div class="asset-actions">
                    <button class="asset-expand" type="button" aria-expanded="false">
                        <span>Expand</span>
                        <i class="ph ph-caret-down"></i>
                    </button>
                </div>
                <div class="asset-detail">
                    <div class="asset-detail-header">
                        <div class="detail-title">Performance Signals</div>
                        <div class="timeframe-toggle" role="tablist" aria-label="Select timeframe">
                            <button class="timeframe-btn active" type="button" data-range="week">1W</button>
                            <button class="timeframe-btn" type="button" data-range="month">1M</button>
                            <button class="timeframe-btn" type="button" data-range="year">1Y</button>
                        </div>
                    </div>
                    <div class="detail-chart">
                        <svg viewBox="0 0 ${chartSizing.detail.width} ${chartSizing.detail.height}" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="${detailId}" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stop-color="var(--chart-color)" stop-opacity="0.5" />
                                    <stop offset="100%" stop-color="var(--chart-color)" stop-opacity="0" />
                                </linearGradient>
                                <filter id="${detailId}-glow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="2.8" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <g class="chart-grid">
                                <line x1="0" y1="30" x2="${chartSizing.detail.width}" y2="30"></line>
                                <line x1="0" y1="60" x2="${chartSizing.detail.width}" y2="60"></line>
                                <line x1="0" y1="90" x2="${chartSizing.detail.width}" y2="90"></line>
                            </g>
                            <path class="detail-area" d="${detailPaths.area}" fill="url(#${detailId})"></path>
                            <path class="detail-line detail-glow" d="${detailPaths.line}" filter="url(#${detailId}-glow)"></path>
                            <path class="detail-line" d="${detailPaths.line}"></path>
                        </svg>
                    </div>
                    <div class="detail-stats">
                        <div class="detail-stat">
                            <span class="detail-stat-label">High</span>
                            <span class="detail-stat-value detail-high font-mono">${formatCurrency(detailStats.max, item.currency)}</span>
                        </div>
                        <div class="detail-stat">
                            <span class="detail-stat-label">Low</span>
                            <span class="detail-stat-value detail-low font-mono">${formatCurrency(detailStats.min, item.currency)}</span>
                        </div>
                        <div class="detail-stat">
                            <span class="detail-stat-label">Close</span>
                            <span class="detail-stat-value detail-close font-mono">${formatCurrency(detailStats.end, item.currency)}</span>
                        </div>
                        <div class="detail-stat">
                            <span class="detail-stat-label">Momentum</span>
                            <span class="detail-stat-value detail-momentum font-mono">${detailStats.change >= 0 ? '+' : ''}${detailStats.change.toFixed(2)}%</span>
                        </div>
                    </div>
                </div>
            `;
            portfolioList.appendChild(row);

            const expandButton = row.querySelector('.asset-expand');
            const timeframeButtons = row.querySelectorAll('.timeframe-btn');
            const detailLine = row.querySelector('.detail-line:not(.detail-glow)');
            const detailArea = row.querySelector('.detail-area');
            const detailGlow = row.querySelector('.detail-glow');
            const detailHigh = row.querySelector('.detail-high');
            const detailLow = row.querySelector('.detail-low');
            const detailClose = row.querySelector('.detail-close');
            const detailMomentum = row.querySelector('.detail-momentum');

            const updateDetail = (range) => {
                const series = item.series[range];
                const paths = buildChartPaths(series, chartSizing.detail.width, chartSizing.detail.height, chartSizing.detail.padding);
                const stats = getSeriesStats(series);

                detailLine.setAttribute('d', paths.line);
                detailArea.setAttribute('d', paths.area);
                if (detailGlow) {
                    detailGlow.setAttribute('d', paths.line);
                }

                detailHigh.textContent = formatCurrency(stats.max, item.currency);
                detailLow.textContent = formatCurrency(stats.min, item.currency);
                detailClose.textContent = formatCurrency(stats.end, item.currency);
                detailMomentum.textContent = `${stats.change >= 0 ? '+' : ''}${stats.change.toFixed(2)}%`;
                detailMomentum.classList.toggle('positive', stats.change >= 0);
                detailMomentum.classList.toggle('negative', stats.change < 0);
            };

            expandButton.addEventListener('click', () => {
                const isExpanded = row.classList.toggle('expanded');
                expandButton.setAttribute('aria-expanded', String(isExpanded));
                expandButton.querySelector('span').textContent = isExpanded ? 'Collapse' : 'Expand';
            });

            timeframeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    timeframeButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    updateDetail(button.dataset.range);
                });
            });

            updateDetail('month');
        });
    }

    // --- LOCAL STORAGE KEYS ---
    const STORAGE_KEYS = {
        balance: 'paynless_balance',
        transactions: 'paynless_transactions',
        conversationHistory: 'paynless_chat_history'
    };

    // --- DEFAULT TRANSACTION DATA ---
    const defaultTransactions = [
        { name: 'Salary Deposit', date: 'Nov 25', amount: 85000, type: 'income', icon: 'ph-bank' },
        { name: 'Rent Payment', date: 'Nov 24', amount: -25000, type: 'expense', icon: 'ph-house' },
        { name: 'Freelance Project', date: 'Nov 23', amount: 15000, type: 'income', icon: 'ph-code' },
        { name: 'Groceries', date: 'Nov 22', amount: -2500, type: 'expense', icon: 'ph-shopping-cart' },
        { name: 'Investment Return', date: 'Nov 21', amount: 8500, type: 'income', icon: 'ph-chart-line-up' },
        { name: 'Internet Bill', date: 'Nov 20', amount: -1200, type: 'expense', icon: 'ph-wifi-high' },
        { name: 'Client Payment', date: 'Nov 19', amount: 12000, type: 'income', icon: 'ph-money' },
        { name: 'Electricity', date: 'Nov 18', amount: -890, type: 'expense', icon: 'ph-lightning' }
    ];

    // --- LOAD FROM LOCAL STORAGE OR USE DEFAULTS ---
    function loadFromStorage(key, defaultValue) {
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading from localStorage:', e);
        }
        return defaultValue;
    }

    function saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    // --- TRANSACTION HISTORY DATA (loaded from storage or defaults) ---
    const transactionData = loadFromStorage(STORAGE_KEYS.transactions, defaultTransactions);

    const transactionList = document.getElementById('transactionList');

    // --- SUBSCRIPTIONS DATA (moved up for AI access) ---
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

    // --- AI CHAT INTERFACE ---
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatWindow = document.getElementById('chatWindow');
    const imageInput = document.getElementById('imageInput');
    const uploadBtn = document.getElementById('uploadBtn');

    // Multi-turn conversation history (loaded from storage)
    let conversationHistory = loadFromStorage(STORAGE_KEYS.conversationHistory, []);

    // Current wallet balance (loaded from storage or default)
    let currentBalance = loadFromStorage(STORAGE_KEYS.balance, 124592);

    // Track if AI is currently processing
    let isProcessing = false;

    // Track pending image for upload
    let pendingImage = null;

    // --- TOAST NOTIFICATIONS ---
    function showToast(title, message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconClass = 'ph-info';
        if (type === 'success') iconClass = 'ph-check-circle';
        if (type === 'error') iconClass = 'ph-warning-circle';

        toast.innerHTML = `
            <div class="toast-icon"><i class="ph ${iconClass}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        container.appendChild(toast);

        // Remove after 1.5 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 1500);
    }

    // Initialize balance display from stored value
    function initializeBalanceDisplay() {
        const balanceElement = document.querySelector('.balance');
        if (balanceElement) {
            balanceElement.textContent = formatBalance(currentBalance);
        }
    }

    // Image upload handling
    async function handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Invalid File', 'Please select a valid image file.', 'error');
            addMessage('Please select a valid image file.', false);
            return;
        }

        // Show a loading/processing toast
        showToast('Processing', 'Compressing image...', 'info');

        try {
            // Options for compression
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1280,
                useWebWorker: true
            };

            // Compress the file
            const compressedFile = await imageCompression(file, options);

            // Create a Blob URL for efficient preview (prevents UI lag)
            const previewUrl = URL.createObjectURL(compressedFile);

            const reader = new FileReader();
            reader.onload = (e) => {
                pendingImage = {
                    data: e.target.result.split(',')[1], // Base64 data without prefix for API
                    mimeType: compressedFile.type,
                    name: file.name,
                    blobUrl: previewUrl // Blob URL for local preview
                };

                // Update upload button to show image is attached
                uploadBtn.classList.add('has-image');
                uploadBtn.innerHTML = '<i class="ph ph-check"></i>';
                uploadBtn.title = `Image attached: ${file.name}`;

                // Update placeholder to indicate image is attached
                chatInput.placeholder = `Image attached: ${file.name.substring(0, 20)}...`;

                showToast('Image Attached', `${file.name} (${(compressedFile.size / 1024).toFixed(1)} KB)`, 'success');
            };
            reader.readAsDataURL(compressedFile);

        } catch (error) {
            console.error('Image compression failed:', error);
            showToast('Error', 'Failed to process image', 'error');
        }
    }

    function clearPendingImage() {
        pendingImage = null;
        imageInput.value = '';
        uploadBtn.classList.remove('has-image');
        uploadBtn.innerHTML = '<i class="ph ph-image"></i>';
        uploadBtn.title = 'Upload receipt or bill';
        chatInput.placeholder = 'Ask anything...';
    }

    // Setup image upload event listeners
    if (uploadBtn && imageInput) {
        uploadBtn.addEventListener('click', () => {
            if (pendingImage) {
                // If already has image, clear it
                clearPendingImage();
            } else {
                imageInput.click();
            }
        });

        imageInput.addEventListener('change', handleImageSelect);
    }

    function formatBalance(amount) {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function addMessage(text, isUser = false, isTyping = false, imageData = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user' : 'ai'}${isTyping ? ' typing' : ''}`;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (isTyping) {
            msgDiv.innerHTML = `
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
        } else {
            let imageHtml = '';
            if (imageData) {
                // Prefer Blob URL for performance, fallback to base64 if needed
                const src = imageData.blobUrl || `data:${imageData.mimeType};base64,${imageData.data}`;
                imageHtml = `<img src="${src}" alt="Uploaded image" class="message-image">`;
            }
            msgDiv.innerHTML = `
                ${imageHtml}
                <p>${text}</p>
                <span class="time">${time}</span>
            `;
        }

        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        return msgDiv;
    }

    function removeTypingIndicator() {
        const typingMsg = chatWindow.querySelector('.message.typing');
        if (typingMsg) {
            typingMsg.remove();
        }
    }

    function updateBalanceUI(newBalance) {
        currentBalance = newBalance;
        const balanceElement = document.querySelector('.balance');
        if (balanceElement) {
            balanceElement.textContent = formatBalance(newBalance);
            balanceElement.classList.add('balance-updated');
            setTimeout(() => balanceElement.classList.remove('balance-updated'), 600);
        }

        // Save to localStorage
        saveToStorage(STORAGE_KEYS.balance, currentBalance);

        // Recalculate earnings and spending from transactions
        updateWalletStats();
    }

    function updateWalletStats() {
        const earnings = transactionData.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
        const spending = Math.abs(transactionData.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0));

        const earningsElement = document.querySelector('.stat.positive .value');
        const spendingElement = document.querySelector('.stat.negative .value');

        if (earningsElement) {
            earningsElement.textContent = `₹${earnings.toLocaleString('en-IN')}`;
        }
        if (spendingElement) {
            spendingElement.textContent = `₹${spending.toLocaleString('en-IN')}`;
        }
    }

    function addTransactionToData(transaction, skipBalanceUpdate = false) {
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const newTx = {
            name: transaction.name,
            date: dateStr,
            amount: transaction.amount,
            type: transaction.type || (transaction.amount >= 0 ? 'income' : 'expense'),
            icon: transaction.icon || (transaction.amount >= 0 ? 'ph-money' : 'ph-shopping-cart')
        };

        // Add to beginning of array (most recent first)
        transactionData.unshift(newTx);

        // Save transactions to localStorage
        saveToStorage(STORAGE_KEYS.transactions, transactionData);

        // Update the balance (unless skip is specified, which happens when update_balance is also provided)
        if (!skipBalanceUpdate) {
            currentBalance += transaction.amount;
            updateBalanceUI(currentBalance);
        }

        // Re-render transactions with animation
        renderTransactions();

        // Highlight the new transaction
        setTimeout(() => {
            const firstItem = transactionList.querySelector('.transaction-item');
            if (firstItem) {
                firstItem.classList.add('transaction-new');
                setTimeout(() => firstItem.classList.remove('transaction-new'), 1000);
            }
        }, 50);

        // Show toast
        showToast('Transaction Added', `${transaction.name}: ${formatBalance(transaction.amount)}`, 'success');
    }

    function removeTransactionFromData(index, skipBalanceUpdate = false) {
        if (index >= 0 && index < transactionData.length) {
            const removedTx = transactionData[index];

            // Reverse the transaction effect on balance
            if (!skipBalanceUpdate) {
                currentBalance -= removedTx.amount;
                updateBalanceUI(currentBalance);
            }

            // Remove the transaction
            transactionData.splice(index, 1);

            // Save transactions to localStorage
            saveToStorage(STORAGE_KEYS.transactions, transactionData);

            // Re-render
            renderTransactions();

            showToast('Transaction Removed', `${removedTx.name} has been deleted`, 'info');
        }
    }

    async function sendToAI(userMessage, imageData = null) {
        if (isProcessing) return;

        isProcessing = true;
        sendBtn.disabled = true;
        chatInput.disabled = true;
        if (uploadBtn) uploadBtn.disabled = true;

        // Add typing indicator
        addMessage('', false, true);

        try {
            // Build request body
            const requestBody = {
                message: userMessage,
                history: conversationHistory,
                balance: currentBalance,
                transactions: transactionData,
                subscriptions: subscriptionsData,
            };

            // Add image data if present
            if (imageData) {
                requestBody.image = {
                    data: imageData.data,
                    mimeType: imageData.mimeType
                };
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();

            // Remove typing indicator
            removeTypingIndicator();

            if (result.success && result.data) {
                const data = result.data;

                // Add AI response to chat
                addMessage(data.response, false);

                // Update conversation history for multi-turn context
                conversationHistory.push({ role: 'user', text: userMessage });
                conversationHistory.push({ role: 'model', text: data.response });

                // Keep conversation history manageable (last 20 turns)
                if (conversationHistory.length > 40) {
                    conversationHistory = conversationHistory.slice(-40);
                }

                // Save conversation history to localStorage
                saveToStorage(STORAGE_KEYS.conversationHistory, conversationHistory);

                // Handle structured actions
                // If both update_balance and add_transaction are provided, use update_balance as authoritative
                const hasExplicitBalanceUpdate = data.update_balance !== null && data.update_balance !== undefined;

                if (hasExplicitBalanceUpdate) {
                    updateBalanceUI(data.update_balance);
                    showToast('Balance Updated', `New balance: ${formatBalance(data.update_balance)}`, 'success');
                }

                if (data.add_transaction) {
                    // Skip balance update in addTransactionToData if we already got an explicit balance update
                    addTransactionToData(data.add_transaction, hasExplicitBalanceUpdate);
                }

                if (data.remove_transaction !== null && data.remove_transaction !== undefined) {
                    removeTransactionFromData(data.remove_transaction, hasExplicitBalanceUpdate);
                }

            } else {
                // Handle error response
                const errorMsg = result.data?.response || result.error || 'Something went wrong. Please try again.';
                addMessage(errorMsg, false);
                showToast('Error', 'Failed to get a response from AI', 'error');
            }

        } catch (error) {
            console.error('Chat error:', error);
            removeTypingIndicator();
            addMessage('I\'m having trouble connecting right now. Please check your connection and try again.', false);
            showToast('Connection Error', 'Could not connect to the server', 'error');
        } finally {
            isProcessing = false;
            sendBtn.disabled = false;
            chatInput.disabled = false;
            if (uploadBtn) uploadBtn.disabled = false;
            chatInput.focus();
        }
    }

    function handleSend() {
        const text = chatInput.value.trim();

        // Allow sending with just an image (with default prompt)
        if (!text && !pendingImage) return;
        if (isProcessing) return;

        const messageText = text || 'Please analyze this image.';
        const imageToSend = pendingImage;

        // Add user message with image if present
        addMessage(messageText, true, false, imageToSend);
        chatInput.value = '';

        // Clear the pending image after sending
        if (pendingImage) {
            clearPendingImage();
        }

        // Send to AI with optional image
        sendToAI(messageText, imageToSend);
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    // --- QUICK ACTIONS ---
    const quickActions = document.getElementById('quickActions');
    if (quickActions) {
        quickActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-chip')) {
                const prompt = e.target.getAttribute('data-prompt');
                chatInput.value = prompt;
                // Optional: Automatically send or just populate
                // handleSend(); 
                chatInput.focus();
            }
        });
    }

    // --- TRANSACTION HISTORY RENDERING ---
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
    initializeBalanceDisplay();
    updateWalletStats();

    // --- AI TOGGLE COMET ANIMATION ---
    const aiBtn = document.querySelector('.ai-toggle-btn');
    if (aiBtn) {
        const rects = aiBtn.querySelectorAll('rect');

        // ResizeObserver for responsive SVG sizing
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                let height;
                if (entry.borderBoxSize) {
                    const borderBoxSize = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;
                    height = borderBoxSize.blockSize;
                } else {
                    height = entry.contentRect.height; // Fallback, might be inaccurate with padding
                }

                // Ensure pill shape
                const rx = height / 2;
                rects.forEach(rect => {
                    rect.setAttribute('rx', rx);
                    rect.setAttribute('ry', rx);
                });
            }
        });

        observer.observe(aiBtn);

        // Initial Animation Loop (Twice)
        // 2 loops * 2s duration = 4000ms
        aiBtn.classList.add('animating');
        setTimeout(() => {
            aiBtn.classList.remove('animating');
        }, 4000);
    }
});
