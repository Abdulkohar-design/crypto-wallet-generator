// ===================== API CONFIGURATION =====================
const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api/blockchain'
        : '/api/blockchain', // Will be proxied by Netlify
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
};

// ===================== BLOCKCHAIN CONFIGURATION =====================// ===================== BLOCKCHAIN CONFIGURATION =====================
const blockchainConfig = {
    btc: {
        name: "Bitcoin",
        symbol: "BTC",
        explorer: "https://blockchair.com/bitcoin/address/",
        decimal: 8,
        color: "#f7931a",
        derivationPath: "m/44'/0'/0'/0/0"
    },
    eth: {
        name: "Ethereum",
        symbol: "ETH",
        explorer: "https://etherscan.io/address/",
        decimal: 18,
        color: "#627eea",
        derivationPath: "m/44'/60'/0'/0/0"
    },
    bsc: {
        name: "Binance Smart Chain",
        symbol: "BNB",
        explorer: "https://bscscan.com/address/",
        decimal: 18,
        color: "#f0b90b",
        derivationPath: "m/44'/60'/0'/0/0"
    },
    sol: {
        name: "Solana",
        symbol: "SOL",
        explorer: "https://explorer.solana.com/address/",
        decimal: 9,
        color: "#00ffbd",
        derivationPath: "m/44'/501'/0'/0'"
    },
    xrp: {
        name: "Ripple",
        symbol: "XRP",
        explorer: "https://xrpscan.com/account/",
        decimal: 6,
        color: "#27a2db",
        derivationPath: "m/44'/144'/0'/0/0"
    },
    ada: {
        name: "Cardano",
        symbol: "ADA",
        explorer: "https://cardanoscan.io/address/",
        decimal: 6,
        color: "#0033ad",
        derivationPath: "m/44'/1815'/0'/0/0"
    },
    doge: {
        name: "Dogecoin",
        symbol: "DOGE",
        explorer: "https://blockchair.com/dogecoin/address/",
        decimal: 8,
        color: "#c2a633",
        derivationPath: "m/44'/3'/0'/0/0"
    },
    ltc: {
        name: "Litecoin",
        symbol: "LTC",
        explorer: "https://blockchair.com/litecoin/address/",
        decimal: 8,
        color: "#345d9d",
        derivationPath: "m/44'/2'/0'/0/0"
    },
    trx: {
        name: "Tron",
        symbol: "TRX",
        explorer: "https://tronscan.org/#/address/",
        decimal: 6,
        color: "#ff060a",
        derivationPath: "m/44'/195'/0'/0/0"
    },
    dot: {
        name: "Polkadot",
        symbol: "DOT",
        explorer: "https://polkadot.subscan.io/account/",
        decimal: 10,
        color: "#e6007a",
        derivationPath: "m/44'/354'/0'/0'/0'"
    },
    avax: {
        name: "Avalanche",
        symbol: "AVAX",
        explorer: "https://snowtrace.io/address/",
        decimal: 18,
        color: "#e84142",
        derivationPath: "m/44'/60'/0'/0/0"
    },
    matic: {
        name: "Polygon",
        symbol: "MATIC",
        explorer: "https://polygonscan.com/address/",
        decimal: 18,
        color: "#8247e5",
        derivationPath: "m/44'/60'/0'/0/0"
    },
    xlm: {
        name: "Stellar",
        symbol: "XLM",
        explorer: "https://stellarchain.io/address/",
        decimal: 7,
        color: "#000000",
        derivationPath: "m/44'/148'/0'"
    },
    atom: {
        name: "Cosmos",
        symbol: "ATOM",
        explorer: "https://www.mintscan.io/cosmos/account/",
        decimal: 6,
        color: "#2e3148",
        derivationPath: "m/44'/118'/0'/0/0"
    },
    link: {
        name: "Chainlink",
        symbol: "LINK",
        explorer: "https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca?a=",
        decimal: 18,
        color: "#2a5ada",
        derivationPath: "m/44'/60'/0'/0/0"
    },
    bnb: {
        name: "BNB Chain",
        symbol: "BNB",
        explorer: "https://explorer.bnbchain.org/address/",
        decimal: 18,
        color: "#f3ba2f",
        derivationPath: "m/44'/714'/0'/0/0"
    }
};

// ===================== MAIN APPLICATION =====================
class CryptoWalletApp {
    constructor() {
        this.currentWallet = null;
        this.currentCurrency = 'USD';
        this.exchangeRates = {};
        this.balanceChart = null;
        this.isTestnet = false;
        
        // Initialize
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        await this.loadExchangeRates();
        this.setupProgressTracking();
    }
    
    setupEventListeners() {
        // Generate button
        document.getElementById('generate-btn').addEventListener('click', () => this.generateWallet());
        
        // Copy buttons
        document.getElementById('copy-phrase').addEventListener('click', () => this.copyToClipboard('phrase'));
        document.getElementById('copy-private').addEventListener('click', () => this.copyToClipboard('private'));
        
        // Hide buttons
        document.getElementById('hide-phrase').addEventListener('click', () => this.toggleVisibility('phrase'));
        document.getElementById('hide-private').addEventListener('click', () => this.toggleVisibility('private'));
        
        // QR buttons
        document.getElementById('qr-phrase').addEventListener('click', () => this.showQRCode('phrase'));
        document.getElementById('qr-private').addEventListener('click', () => this.showQRCode('private'));
        
        // Save buttons
        document.getElementById('save-pdf').addEventListener('click', () => this.saveAsPDF());
        document.getElementById('save-json').addEventListener('click', () => this.saveAsJSON());
        document.getElementById('import-wallet').addEventListener('click', () => this.showImportModal());
        
        // Refresh and chart
        document.getElementById('refresh-balances').addEventListener('click', () => this.refreshBalances());
        document.getElementById('view-chart').addEventListener('click', () => this.toggleChart());
        document.getElementById('export-addresses').addEventListener('click', () => this.exportAddresses());
        
        // Currency and network selectors
        document.getElementById('currency').addEventListener('change', (e) => {
            this.currentCurrency = e.target.value;
            this.updateBalances();
        });
        
        document.getElementById('network').addEventListener('change', (e) => {
            this.isTestnet = e.target.value === 'testnet';
        });
        
        // Import modal events
        document.getElementById('import-method').addEventListener('change', (e) => this.toggleImportInputs(e.target.value));
        document.getElementById('import-confirm').addEventListener('click', () => this.importWallet());
    }
    
    async loadExchangeRates() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/exchange-rates`);
            if (response.ok) {
                const data = await response.json();
                this.exchangeRates = data.rates || {
                    USD: 1,
                    IDR: 15000,
                    EUR: 0.85
                };
            } else {
                // Fallback rates if API fails
                this.exchangeRates = {
                    USD: 1,
                    IDR: 15000,
                    EUR: 0.85
                };
            }
        } catch (error) {
            console.error('Failed to load exchange rates:', error);
            // Fallback rates
            this.exchangeRates = {
                USD: 1,
                IDR: 15000,
                EUR: 0.85
            };
        }
    }
    
    setupProgressTracking() {
        this.progressSteps = [
            'Generating entropy...',
            'Creating mnemonic phrase...',
            'Deriving master key...',
            'Generating addresses...',
            'Fetching balances...',
            'Complete!'
        ];
    }
    
    async generateWallet() {
        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        const progressBar = document.getElementById('loading-progress');
        loadingModal.show();
        
        try {
            // Progress tracking
            for (let i = 0; i < this.progressSteps.length; i++) {
                const progress = ((i + 1) / this.progressSteps.length) * 100;
                progressBar.style.width = progress + '%';
                await this.delay(300);
            }
            
            // Get configuration
            const strength = parseInt(document.getElementById('strength').value);
            const language = document.getElementById('language').value;
            
            // Generate mnemonic with specified language
            const mnemonic = bip39.generateMnemonic(strength, null, bip39.wordlists[language] || bip39.wordlists.english);
            
            // Generate seed and master private key
            const seed = bip39.mnemonicToSeedHex(mnemonic);
            const masterPrivateKey = seed.substring(0, 64);
            
            // Store wallet data
            this.currentWallet = {
                mnemonic,
                seed,
                masterPrivateKey,
                addresses: {},
                balances: {},
                createdAt: new Date().toISOString(),
                network: this.isTestnet ? 'testnet' : 'mainnet'
            };
            
            // Update UI
            this.updateWalletInfo();
            
            // Generate addresses for all supported blockchains
            await this.generateAllAddresses();
            
            // Fetch balances (simulated for demo)
            await this.fetchAllBalances();
            
            // Update UI with balances
            this.updateBalances();
            this.showBalanceSummary();
            
        } catch (error) {
            console.error('Error generating wallet:', error);
            this.showError('Failed to generate wallet: ' + error.message);
        } finally {
            loadingModal.hide();
        }
    }
    
    updateWalletInfo() {
        // Update phrase display
        document.getElementById('phrase-result').innerHTML = `
            <div class="d-flex flex-wrap gap-2">
                ${this.currentWallet.mnemonic.split(' ').map((word, index) => 
                    `<span class="badge bg-secondary">${index + 1}. ${word}</span>`
                ).join('')}
            </div>
        `;
        
        // Update private key display
        document.getElementById('private-result').innerHTML = `
            <div class="text-center">
                <p class="mb-0 font-monospace">${this.currentWallet.masterPrivateKey}</p>
            </div>
        `;
    }
    
    async generateAllAddresses() {
        try {
            const seed = Buffer.from(this.currentWallet.seed, 'hex');
            
            for (const [blockchain, config] of Object.entries(blockchainConfig)) {
                try {
                    let address;
                    
                    switch (blockchain) {
                        case 'btc':
                        case 'ltc':
                        case 'doge':
                            address = this.generateBitcoinLikeAddress(seed, config, blockchain);
                            break;
                        case 'eth':
                        case 'bsc':
                        case 'avax':
                        case 'matic':
                        case 'link':
                            address = this.generateEthereumLikeAddress(seed, config);
                            break;
                        default:
                            // For other blockchains, generate a placeholder address
                            address = this.generatePlaceholderAddress(blockchain);
                    }
                    
                    this.currentWallet.addresses[blockchain] = address;
                } catch (error) {
                    console.error(`Error generating ${blockchain} address:`, error);
                    this.currentWallet.addresses[blockchain] = 'Error generating address';
                }
            }
        } catch (error) {
            console.error('Error generating addresses:', error);
            throw new Error('Failed to generate addresses');
        }
    }
    
    generateBitcoinLikeAddress(seed, config, blockchain) {
        try {
            // Use the master private key for Bitcoin-like addresses
            const privateKey = Buffer.from(this.currentWallet.masterPrivateKey, 'hex');
            const keyPair = bitcoin.ECPair.fromPrivateKey(privateKey);
            
            // Generate P2PKH address
            const { address } = bitcoin.payments.p2pkh({ 
                pubkey: keyPair.publicKey,
                network: this.isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
            });
            
            return address;
        } catch (error) {
            console.error(`Error generating ${blockchain} address:`, error);
            return this.generatePlaceholderAddress(blockchain);
        }
    }
    
    generateEthereumLikeAddress(seed, config) {
        try {
            // For Ethereum-like addresses, derive from the master private key
            const privateKey = Buffer.from(this.currentWallet.masterPrivateKey, 'hex');
            
            // Generate Ethereum address using keccak256
            const publicKey = bitcoin.ECPair.fromPrivateKey(privateKey).publicKey;
            const address = this.publicKeyToEthereumAddress(publicKey);
            
            return address;
        } catch (error) {
            console.error('Error generating Ethereum-like address:', error);
            return this.generatePlaceholderAddress('eth');
        }
    }
    
    publicKeyToEthereumAddress(publicKey) {
        // Remove the first byte (0x04) from uncompressed public key
        const publicKeyBytes = publicKey.slice(1);
        
        // Hash with keccak256 (simplified - using crypto-js as substitute)
        const hash = CryptoJS.SHA3(CryptoJS.lib.WordArray.create(publicKeyBytes), { outputLength: 256 });
        
        // Take last 20 bytes and add 0x prefix
        const address = '0x' + hash.toString(CryptoJS.enc.Hex).slice(-40);
        
        return address;
    }
    
    generatePlaceholderAddress(blockchain) {
        const prefixes = {
            sol: 'Sol',
            xrp: 'r',
            ada: 'addr1',
            trx: 'T',
            dot: '1',
            xlm: 'G',
            atom: 'cosmos1',
            bnb: 'bnb1'
        };
        
        const prefix = prefixes[blockchain] || blockchain;
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        return `${prefix}${randomSuffix}${Math.random().toString(36).substring(2, 15)}`;
    }
    
    async fetchAllBalances() {
        try {
            if (!this.currentWallet || !this.currentWallet.addresses) {
                throw new Error('No wallet addresses available');
            }

            // Prepare requests for backend API
            const requests = Object.keys(blockchainConfig).map(blockchain => ({
                blockchain: blockchain.toUpperCase(),
                address: this.currentWallet.addresses[blockchain],
                currency: this.currentCurrency
            }));

            // Call backend API for real balance checking
            const response = await fetch(`${API_CONFIG.BASE_URL}/balances`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requests })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.balances) {
                    // Update balances from API response
                    data.balances.forEach(balance => {
                        const blockchain = balance.blockchain.toLowerCase();
                        this.currentWallet.balances[blockchain] = balance.balance || 0;
                    });
                } else {
                    throw new Error('Invalid API response');
                }
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Error fetching balances:', error);
            
            // Fallback to simulated balances for demo
            for (const blockchain of Object.keys(blockchainConfig)) {
                const balance = Math.random() * (blockchain === 'btc' ? 0.1 : 
                                               blockchain === 'eth' ? 2 : 
                                               blockchain === 'doge' ? 1000 : 10);
                
                this.currentWallet.balances[blockchain] = balance;
                
                // Add small delay to simulate API calls
                await this.delay(100);
            }
        }
    }
    
    updateBalances() {
        if (!this.currentWallet) return;
        
        const walletsContainer = document.getElementById('wallets-container');
        walletsContainer.innerHTML = '';
        
        let totalValue = 0;
        let activeWallets = 0;
        let highestBalance = 0;
        
        // Add balance cards for each blockchain
        for (const [blockchain, config] of Object.entries(blockchainConfig)) {
            const balance = this.currentWallet.balances[blockchain] || 0;
            const address = this.currentWallet.addresses[blockchain] || 'Not generated';
            
            // Calculate value in selected currency
            const usdValue = balance * this.getExchangeRate(blockchain);
            const value = this.convertCurrency(usdValue, this.currentCurrency);
            
            totalValue += value;
            if (balance > 0) activeWallets++;
            if (value > highestBalance) highestBalance = value;
            
            const formattedBalance = this.formatNumber(balance, config.decimal);
            const formattedValue = this.formatCurrency(value, this.currentCurrency);
            
            walletsContainer.innerHTML += this.createBalanceCard(blockchain, config, address, formattedBalance, formattedValue);
        }
        
        // Update summary
        this.updateSummary(totalValue, activeWallets, highestBalance);
        
        // Update chart
        this.updateChart();
        
        // Add event listeners for copy buttons
        this.setupCopyButtons();
    }
    
    createBalanceCard(blockchain, config, address, formattedBalance, formattedValue) {
        const shortAddress = address.length > 20 ? 
            address.substring(0, 10) + '...' + address.substring(address.length - 10) : 
            address;
            
        return `
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="card balance-card h-100 slide-in-up">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="coin-icon ${blockchain} me-3">
                                <i class="fab fa-${this.getCoinIcon(blockchain)}"></i>
                            </div>
                            <div>
                                <h5 class="mb-0">${config.name}</h5>
                                <small class="text-muted">${config.symbol}</small>
                            </div>
                            <div class="network-status network-online"></div>
                        </div>
                        
                        <div class="mb-3">
                            <small class="text-muted">Address</small>
                            <div class="address-box mt-1" title="${address}">
                                ${shortAddress}
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-muted">Balance</small>
                                <h4 class="mb-0">${formattedBalance} ${config.symbol}</h4>
                            </div>
                            <div class="text-end">
                                <small class="text-muted">Value</small>
                                <h4 class="mb-0 text-success">${formattedValue}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-dark d-flex justify-content-between">
                        <a href="${config.explorer}${address}" target="_blank" class="text-info">
                            <i class="fas fa-external-link-alt me-1"></i>Explorer
                        </a>
                        <span class="copy-btn" title="Copy address" data-copy="${address}">
                            <i class="far fa-copy"></i>
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
    
    getCoinIcon(blockchain) {
        const icons = {
            btc: 'bitcoin',
            eth: 'ethereum',
            bsc: 'bitcoin', // No specific BSC icon
            sol: 'bitcoin', // No specific Solana icon
            xrp: 'bitcoin', // No specific XRP icon
            ada: 'bitcoin', // No specific Cardano icon
            doge: 'bitcoin', // No specific Dogecoin icon
            ltc: 'bitcoin', // No specific Litecoin icon
            trx: 'bitcoin', // No specific Tron icon
            dot: 'bitcoin', // No specific Polkadot icon
            avax: 'bitcoin', // No specific Avalanche icon
            matic: 'bitcoin', // No specific Polygon icon
            xlm: 'bitcoin', // No specific Stellar icon
            atom: 'bitcoin', // No specific Cosmos icon
            link: 'bitcoin', // No specific Chainlink icon
            bnb: 'bitcoin'  // No specific BNB icon
        };
        
        return icons[blockchain] || 'coins';
    }
    
    getExchangeRate(blockchain) {
        // Simulated exchange rates (in a real app, fetch from API)
        const rates = {
            btc: 45000,
            eth: 2500,
            bsc: 300,
            sol: 100,
            xrp: 0.5,
            ada: 0.4,
            doge: 0.08,
            ltc: 70,
            trx: 0.1,
            dot: 6,
            avax: 20,
            matic: 0.8,
            xlm: 0.1,
            atom: 10,
            link: 15,
            bnb: 300
        };
        
        return rates[blockchain] || 1;
    }
    
    convertCurrency(usdValue, targetCurrency) {
        const rate = this.exchangeRates[targetCurrency] || 1;
        return usdValue * rate;
    }
    
    formatNumber(number, decimals) {
        return parseFloat(number).toFixed(Math.min(decimals, 6));
    }
    
    formatCurrency(value, currency) {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        } catch (error) {
            const symbols = { USD: '$', IDR: 'Rp', EUR: '€' };
            return `${symbols[currency] || '$'}${value.toFixed(2)}`;
        }
    }
    
    updateSummary(totalValue, activeWallets, highestBalance) {
        document.getElementById('total-balance').textContent = this.formatCurrency(totalValue, this.currentCurrency);
        document.getElementById('active-wallets').textContent = activeWallets;
        document.getElementById('highest-balance').textContent = this.formatCurrency(highestBalance, this.currentCurrency);
    }
    
    showBalanceSummary() {
        document.getElementById('balance-summary').style.display = 'flex';
    }
    
    setupCopyButtons() {
        document.querySelectorAll('[data-copy]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.getAttribute('data-copy');
                this.copyToClipboard(text);
            });
        });
    }
    
    updateChart() {
        if (!this.currentWallet) return;
        
        const ctx = document.getElementById('balanceChart').getContext('2d');
        
        // Prepare chart data
        const chartData = [];
        for (const [blockchain, config] of Object.entries(blockchainConfig)) {
            const balance = this.currentWallet.balances[blockchain] || 0;
            if (balance > 0) {
                const usdValue = balance * this.getExchangeRate(blockchain);
                const value = this.convertCurrency(usdValue, this.currentCurrency);
                
                chartData.push({
                    label: config.name,
                    value: value,
                    color: config.color
                });
            }
        }
        
        // Destroy existing chart
        if (this.balanceChart) {
            this.balanceChart.destroy();
        }
        
        // Create new chart
        if (chartData.length > 0) {
            this.balanceChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: chartData.map(item => item.label),
                    datasets: [{
                        data: chartData.map(item => item.value),
                        backgroundColor: chartData.map(item => item.color),
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: '#f5f6fa',
                                font: { size: 12 },
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = this.formatCurrency(context.parsed, this.currentCurrency);
                                    return `${context.label}: ${value}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    toggleChart() {
        const chartContainer = document.getElementById('chart-container');
        const button = document.getElementById('view-chart');
        
        if (chartContainer.style.display === 'none') {
            chartContainer.style.display = 'block';
            button.innerHTML = '<i class="fas fa-chart-bar me-1"></i>Hide Chart';
        } else {
            chartContainer.style.display = 'none';
            button.innerHTML = '<i class="fas fa-chart-pie me-1"></i>View Chart';
        }
    }
    
    async refreshBalances() {
        if (!this.currentWallet) {
            this.showError('Please generate a wallet first');
            return;
        }
        
        const refreshBtn = document.getElementById('refresh-balances');
        const originalHTML = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Refreshing...';
        refreshBtn.disabled = true;
        
        try {
            await this.fetchAllBalances();
            this.updateBalances();
            this.showSuccess('Balances refreshed successfully');
        } catch (error) {
            console.error('Error refreshing balances:', error);
            this.showError('Failed to refresh balances');
        } finally {
            refreshBtn.innerHTML = originalHTML;
            refreshBtn.disabled = false;
        }
    }
    
    copyToClipboard(textOrType) {
        let text = textOrType;
        
        // If it's a type (phrase/private), get the actual text
        if (textOrType === 'phrase' && this.currentWallet) {
            text = this.currentWallet.mnemonic;
        } else if (textOrType === 'private' && this.currentWallet) {
            text = this.currentWallet.masterPrivateKey;
        }
        
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('Copied to clipboard!', 'success');
            }).catch(err => {
                console.error('Failed to copy:', err);
                this.showToast('Failed to copy to clipboard', 'error');
            });
        }
    }
    
    toggleVisibility(type) {
        const element = document.getElementById(`${type}-result`);
        const icon = document.getElementById(`hide-${type}`);
        
        if (element.classList.contains('blurred')) {
            element.classList.remove('blurred');
            icon.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            element.classList.add('blurred');
            icon.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }
    
    showQRCode(type) {
        if (!this.currentWallet) {
            this.showError('Please generate a wallet first');
            return;
        }
        
        let text = '';
        let title = '';
        
        if (type === 'phrase') {
            text = this.currentWallet.mnemonic;
            title = 'Recovery Phrase QR Code';
        } else if (type === 'private') {
            text = this.currentWallet.masterPrivateKey;
            title = 'Private Key QR Code';
        }
        
        if (text) {
            const modal = new bootstrap.Modal(document.getElementById('qrModal'));
            document.getElementById('qrModalTitle').textContent = title;
            
            // Clear previous QR code
            const container = document.getElementById('qrcode-container');
            container.innerHTML = '';
            
            // Generate QR code
            QRCode.toCanvas(container, text, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, (error) => {
                if (error) {
                    console.error('QR Code generation failed:', error);
                    container.innerHTML = '<p class="text-danger">Failed to generate QR code</p>';
                }
            });
            
            modal.show();
        }
    }
    
    saveAsPDF() {
        if (!this.currentWallet) {
            this.showError('Please generate a wallet first');
            return;
        }
        
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Title
            doc.setFontSize(20);
            doc.text('Crypto Wallet Backup', 20, 30);
            
            // Warning
            doc.setFontSize(12);
            doc.setTextColor(255, 0, 0);
            doc.text('⚠️ KEEP THIS DOCUMENT SECURE - ANYONE WITH ACCESS CAN CONTROL YOUR WALLET', 20, 50);
            
            // Reset color
            doc.setTextColor(0, 0, 0);
            
            // Wallet info
            doc.text('Recovery Phrase:', 20, 70);
            doc.setFontSize(10);
            doc.text(this.currentWallet.mnemonic, 20, 80);
            
            doc.setFontSize(12);
            doc.text('Master Private Key:', 20, 100);
            doc.setFontSize(10);
            doc.text(this.currentWallet.masterPrivateKey, 20, 110);
            
            // Addresses
            doc.setFontSize(12);
            doc.text('Addresses:', 20, 130);
            
            let yPos = 140;
            for (const [blockchain, address] of Object.entries(this.currentWallet.addresses)) {
                const config = blockchainConfig[blockchain];
                if (config) {
                    doc.setFontSize(10);
                    doc.text(`${config.name} (${config.symbol}):`, 20, yPos);
                    doc.text(address, 20, yPos + 8);
                    yPos += 20;
                }
            }
            
            // Footer
            doc.setFontSize(8);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
            doc.text('Ultimate Crypto Wallet Generator', 20, 290);
            
            doc.save('crypto-wallet-backup.pdf');
            this.showSuccess('PDF saved successfully');
        } catch (error) {
            console.error('Error saving PDF:', error);
            this.showError('Failed to save PDF');
        }
    }
    
    saveAsJSON() {
        if (!this.currentWallet) {
            this.showError('Please generate a wallet first');
            return;
        }
        
        try {
            const walletData = {
                ...this.currentWallet,
                exportedAt: new Date().toISOString(),
                version: '1.0.0'
            };
            
            const dataStr = JSON.stringify(walletData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `crypto-wallet-backup-${Date.now()}.json`;
            link.click();
            
            this.showSuccess('JSON backup saved successfully');
        } catch (error) {
            console.error('Error saving JSON:', error);
            this.showError('Failed to save JSON backup');
        }
    }
    
    exportAddresses() {
        if (!this.currentWallet) {
            this.showError('Please generate a wallet first');
            return;
        }
        
        try {
            const addressData = [];
            for (const [blockchain, address] of Object.entries(this.currentWallet.addresses)) {
                const config = blockchainConfig[blockchain];
                if (config) {
                    addressData.push({
                        blockchain: config.name,
                        symbol: config.symbol,
                        address: address,
                        explorer: config.explorer + address
                    });
                }
            }
            
            const csvContent = [
                'Blockchain,Symbol,Address,Explorer',
                ...addressData.map(row => `${row.blockchain},${row.symbol},${row.address},${row.explorer}`)
            ].join('\n');
            
            const dataBlob = new Blob([csvContent], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `crypto-addresses-${Date.now()}.csv`;
            link.click();
            
            this.showSuccess('Addresses exported successfully');
        } catch (error) {
            console.error('Error exporting addresses:', error);
            this.showError('Failed to export addresses');
        }
    }
    
    showImportModal() {
        const modal = new bootstrap.Modal(document.getElementById('importModal'));
        modal.show();
    }
    
    toggleImportInputs(method) {
        document.getElementById('mnemonic-input').style.display = method === 'mnemonic' ? 'block' : 'none';
        document.getElementById('private-key-input').style.display = method === 'private-key' ? 'block' : 'none';
        document.getElementById('json-input').style.display = method === 'json' ? 'block' : 'none';
    }
    
    async importWallet() {
        const method = document.getElementById('import-method').value;
        
        try {
            let walletData = null;
            
            if (method === 'mnemonic') {
                const mnemonic = document.getElementById('import-mnemonic').value.trim();
                if (!mnemonic) {
                    this.showError('Please enter a recovery phrase');
                    return;
                }
                
                if (!bip39.validateMnemonic(mnemonic)) {
                    this.showError('Invalid recovery phrase');
                    return;
                }
                
                const seed = bip39.mnemonicToSeedHex(mnemonic);
                walletData = {
                    mnemonic,
                    seed,
                    masterPrivateKey: seed.substring(0, 64),
                    addresses: {},
                    balances: {},
                    createdAt: new Date().toISOString(),
                    network: this.isTestnet ? 'testnet' : 'mainnet'
                };
                
            } else if (method === 'private-key') {
                const privateKey = document.getElementById('import-private-key').value.trim();
                if (!privateKey || privateKey.length !== 64) {
                    this.showError('Please enter a valid 64-character private key');
                    return;
                }
                
                walletData = {
                    mnemonic: 'Imported from private key',
                    seed: privateKey + privateKey, // Duplicate for seed
                    masterPrivateKey: privateKey,
                    addresses: {},
                    balances: {},
                    createdAt: new Date().toISOString(),
                    network: this.isTestnet ? 'testnet' : 'mainnet'
                };
                
            } else if (method === 'json') {
                const fileInput = document.getElementById('import-json');
                if (!fileInput.files[0]) {
                    this.showError('Please select a JSON file');
                    return;
                }
                
                const fileContent = await this.readFile(fileInput.files[0]);
                walletData = JSON.parse(fileContent);
                
                // Validate required fields
                if (!walletData.masterPrivateKey || !walletData.mnemonic) {
                    this.showError('Invalid wallet file format');
                    return;
                }
            }
            
            // Set the imported wallet
            this.currentWallet = walletData;
            
            // Generate addresses and fetch balances
            await this.generateAllAddresses();
            await this.fetchAllBalances();
            
            // Update UI
            this.updateWalletInfo();
            this.updateBalances();
            this.showBalanceSummary();
            
            // Hide modal
            bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
            
            this.showSuccess('Wallet imported successfully');
            
        } catch (error) {
            console.error('Error importing wallet:', error);
            this.showError('Failed to import wallet: ' + error.message);
        }
    }
    
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '9999';
        
        const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
        
        toast.innerHTML = `
            <div class="toast show" role="alert">
                <div class="toast-header ${bgClass} text-white">
                    <strong class="me-auto">${type === 'success' ? 'Success' : 'Error'}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">${message}</div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
    
    showSuccess(message) {
        this.showToast(message, 'success');
    }
    
    showError(message) {
        this.showToast(message, 'error');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CryptoWalletApp();
    
    // Make app globally accessible for debugging
    window.cryptoWalletApp = app;
});