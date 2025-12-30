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

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    // Initialize balance display from stored value
    function initializeBalanceDisplay() {
        const balanceElement = document.querySelector('.balance');
        if (balanceElement) {
            balanceElement.textContent = formatBalance(currentBalance);
        }
    }
    
    // Image upload handling
    function handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Invalid File', 'Please select a valid image file.', 'error');
            addMessage('Please select a valid image file.', false);
            return;
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showToast('File Too Large', 'Please select an image under 10MB.', 'error');
            addMessage('Image is too large. Please select an image under 10MB.', false);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            pendingImage = {
                data: e.target.result.split(',')[1], // Base64 data without prefix
                mimeType: file.type,
                name: file.name
            };
            
            // Update upload button to show image is attached
            uploadBtn.classList.add('has-image');
            uploadBtn.innerHTML = '<i class="ph ph-check"></i>';
            uploadBtn.title = `Image attached: ${file.name}`;
            
            // Update placeholder to indicate image is attached
            chatInput.placeholder = `Image attached: ${file.name.substring(0, 20)}...`;
            
            showToast('Image Attached', file.name, 'success');
        };
        reader.readAsDataURL(file);
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
                imageHtml = `<img src="data:${imageData.mimeType};base64,${imageData.data}" alt="Uploaded image" class="message-image">`;
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

    function removeTransactionFromData(index) {
        if (index >= 0 && index < transactionData.length) {
            const removedTx = transactionData[index];
            
            // Reverse the transaction effect on balance
            currentBalance -= removedTx.amount;
            updateBalanceUI(currentBalance);
            
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
                    removeTransactionFromData(data.remove_transaction);
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