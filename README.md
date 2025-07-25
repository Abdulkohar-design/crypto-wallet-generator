# Crypto Wallet Generator

A comprehensive cryptocurrency wallet generator with multi-blockchain support and real-time balance checking.

## 🚀 Live Demo

- **Frontend**: [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/crypto-wallet-generator)
- **Backend API**: [Deploy to Railway](https://railway.app/new/template/crypto-wallet-backend)

## 📋 Features

### Frontend
- 🎯 **Multi-Blockchain Support**: 16+ cryptocurrencies (BTC, ETH, BSC, SOL, XRP, ADA, DOGE, LTC, TRX, DOT, AVAX, MATIC, XLM, ATOM, LINK, BNB)
- 🔐 **Secure Wallet Generation**: Mnemonic phrases with multiple languages
- 💰 **Real-time Balance Checking**: Live balance updates across all blockchains
- 💱 **Multi-Currency Support**: USD, EUR, IDR with real-time conversion
- 📊 **Portfolio Visualization**: Interactive charts and balance summaries
- 🔄 **Import/Export**: Support for existing wallets and data export
- 📱 **Responsive Design**: Works on desktop and mobile devices

### Backend
- 🌐 **RESTful API**: Comprehensive endpoints for all blockchain operations
- 🔄 **Retry Logic**: Automatic retry with exponential backoff
- 💹 **Exchange Rate Integration**: Multi-provider exchange rate fetching
- 🏥 **Health Monitoring**: Service health checks and status reporting
- 🛡️ **Security Features**: Rate limiting, CORS protection, input validation
- 📈 **Performance**: Concurrent request handling and connection pooling

## 🚀 Deployment Guide

### Deploy Frontend to Netlify

1. **Fork this repository** to your GitHub account

2. **Connect to Netlify**:
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Choose your forked repository
   - Set build settings:
     - **Build command**: `npm run build` (if using build process)
     - **Publish directory**: `frontend`
     - **Base directory**: `frontend`

3. **Configure Environment Variables** in Netlify:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy**: Click "Deploy site"

### Deploy Backend to Railway

1. **Create Railway Account**: Go to [Railway](https://railway.app)

2. **Deploy from GitHub**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

3. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   COINGECKO_API_KEY=your_api_key_here
   CRYPTOCOMPARE_API_KEY=your_api_key_here
   ```

4. **Deploy**: Railway will automatically build and deploy

### Alternative: Deploy Backend to Heroku

1. **Install Heroku CLI**

2. **Create Heroku App**:
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set COINGECKO_API_KEY=your_key
   ```

4. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd frontend
# Open index.html in browser or use live server
# Or setup with build process:
npm install -g live-server
live-server
```

## 📁 Project Structure

```
crypto-wallet-generator/
├── frontend/                 # Static frontend files
│   ├── index.html           # Main HTML file
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css   # Custom styles
│   │   └── js/
│   │       ├── app.js       # Main application logic
│   │       ├── wallet.js    # Wallet generation
│   │       └── chart.js     # Chart functionality
│   └── pdf-template.html    # PDF export template
├── backend/                 # Node.js backend
│   ├── controllers/         # Blockchain controllers
│   ├── services/           # API services
│   ├── routes/             # Express routes
│   ├── middlewares/        # Custom middleware
│   ├── app.js              # Express app setup
│   └── server.js           # Server startup
└── README.md               # This file
```

## 🔧 Configuration

### Frontend Configuration
Update API endpoint in `frontend/assets/js/app.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.railway.app/api/blockchain';
```

### Backend Configuration
Set environment variables in `.env`:
```env
PORT=3001
NODE_ENV=production
COINGECKO_API_KEY=your_key_here
CRYPTOCOMPARE_API_KEY=your_key_here
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blockchain/health` | Health check |
| GET | `/api/blockchain/blockchains` | Supported blockchains |
| GET | `/api/blockchain/exchange-rates` | Exchange rates |
| GET | `/api/blockchain/balance` | Single balance |
| POST | `/api/blockchain/balances` | Multiple balances |
| POST | `/api/blockchain/validate-address` | Address validation |

## 🔒 Security Notes

- All wallet generation happens client-side
- Private keys never leave the browser
- Backend only provides balance checking services
- Use HTTPS in production
- Store API keys securely

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/crypto-wallet-generator/issues)
- 📚 Docs: [Documentation](https://docs.example.com)

## 🎯 Roadmap

- [ ] Mobile app version
- [ ] Hardware wallet integration
- [ ] DeFi protocol support
- [ ] NFT balance checking
- [ ] Multi-language support
- [ ] Advanced portfolio analytics