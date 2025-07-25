# Crypto Wallet Generator Backend

A comprehensive Node.js backend service for cryptocurrency wallet generation, balance checking, and blockchain interaction.

## 🚀 Features

- **Multi-Blockchain Support**: BTC, ETH, BSC, SOL, XRP, ADA, DOGE, LTC, TRX, DOT, AVAX, MATIC, XLM, ATOM, LINK, BNB
- **Real-time Balance Checking**: Single and batch balance queries
- **Exchange Rate Integration**: Multi-currency support (USD, EUR, IDR) with fallback rates
- **Address Validation**: Comprehensive address format validation
- **Health Monitoring**: Service health checks and status monitoring
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Professional structured error responses
- **Retry Logic**: Automatic retry with exponential backoff
- **Graceful Shutdown**: Proper cleanup on server termination

## 📋 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API documentation and endpoint listing |
| GET | `/api/status` | Server status and environment info |

### Blockchain Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blockchain/health` | Services health check |
| GET | `/api/blockchain/blockchains` | List supported blockchains |
| GET | `/api/blockchain/exchange-rates` | Current exchange rates |
| GET | `/api/blockchain/balance` | Single balance check |
| POST | `/api/blockchain/balances` | Multiple balance check |
| POST | `/api/blockchain/validate-address` | Address validation |

## 🔧 Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📝 API Usage Examples

### Get Single Balance
```bash
GET /api/blockchain/balance?blockchain=ETH&address=0x742d35Cc6636C0532925a3b8c17C6D8B9C1e1a3a&currency=USD
```

### Get Multiple Balances
```bash
POST /api/blockchain/balances
Content-Type: application/json

{
  "requests": [
    {
      "blockchain": "ETH",
      "address": "0x742d35Cc6636C0532925a3b8c17C6D8B9C1e1a3a",
      "currency": "USD"
    },
    {
      "blockchain": "BTC",
      "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "currency": "EUR"
    }
  ]
}
```

### Validate Address
```bash
POST /api/blockchain/validate-address
Content-Type: application/json

{
  "blockchain": "ETH",
  "address": "0x742d35Cc6636C0532925a3b8c17C6D8B9C1e1a3a"
}
```

### Get Exchange Rates
```bash
GET /api/blockchain/exchange-rates?currencies=USD,EUR,IDR
```

## 🏗️ Architecture

### Core Components

- **ApiService**: Centralized API service with retry logic and health checking
- **BlockchainControllers**: Individual controllers for each blockchain
- **Routes**: Express routing with comprehensive endpoint mapping
- **Middleware**: Error handling, rate limiting, and CORS configuration
- **Health Checks**: Service monitoring and status reporting

### Directory Structure

```
backend/
├── controllers/           # Blockchain-specific controllers
├── middlewares/          # Express middleware
├── routes/               # API route definitions
├── services/             # Core business logic
├── app.js               # Express application setup
├── server.js            # Server startup and configuration
└── package.json         # Dependencies and scripts
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Error Sanitization**: Safe error responses without sensitive data
- **Timeout Protection**: Request timeout handling

## 📊 Monitoring

### Health Check Response
```json
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "coinGecko": {
      "healthy": true,
      "responseTime": 245,
      "lastCheck": "2024-01-15T10:30:00.000Z"
    },
    "cryptoCompare": {
      "healthy": true,
      "responseTime": 189,
      "lastCheck": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## 🌍 Environment Configuration

### Required Variables
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

### Optional API Keys
- `COINGECKO_API_KEY`: CoinGecko Pro API key
- `CRYPTOCOMPARE_API_KEY`: CryptoCompare API key
- `ETHERSCAN_API_KEY`: Etherscan API key
- `BSCSCAN_API_KEY`: BSCScan API key

### Performance Tuning
- `API_TIMEOUT_MS`: API request timeout (default: 10000)
- `API_RETRY_ATTEMPTS`: Retry attempts (default: 3)
- `RATE_LIMIT_MAX_REQUESTS`: Rate limit (default: 100)

## 🚨 Error Handling

All endpoints return structured error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid blockchain specified",
    "details": {
      "field": "blockchain",
      "value": "INVALID",
      "allowed": ["BTC", "ETH", "BSC", ...]
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📈 Performance

- **Concurrent Requests**: Supports multiple simultaneous balance checks
- **Caching**: Exchange rate caching with TTL
- **Connection Pooling**: Efficient HTTP connection management
- **Retry Logic**: Exponential backoff for failed requests

## 🛠️ Development

### Adding New Blockchain

1. Create controller in `controllers/`
2. Add to supported blockchains list
3. Update routing in `blockchain.route.js`
4. Add validation rules
5. Update documentation

### Testing

```bash
# Test server status
curl http://localhost:3001/api/status

# Test health check
curl http://localhost:3001/api/blockchain/health

# Test balance check
curl "http://localhost:3001/api/blockchain/balance?blockchain=ETH&address=0x742d35Cc6636C0532925a3b8c17C6D8B9C1e1a3a&currency=USD"
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the API documentation at `/` endpoint
- Review the health status at `/api/blockchain/health`