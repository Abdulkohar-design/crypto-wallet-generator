require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');
const blockchainRoutes = require('./routes/blockchain.route');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
}));

// Routes
app.use('/api/blockchain', blockchainRoutes);

// Additional API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Crypto Wallet Generator API',
    version: '1.0.0',
    endpoints: {
      balance: '/api/blockchain/balance?blockchain={blockchain}&address={address}&currency={currency}',
      balances: '/api/blockchain/balances (POST)',
      exchangeRates: '/api/blockchain/exchange-rates',
      health: '/api/blockchain/health',
      blockchains: '/api/blockchain/blockchains',
      validateAddress: '/api/blockchain/validate-address (POST)',
      status: '/api/status'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;