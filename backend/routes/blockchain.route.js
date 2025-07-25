const express = require('express');
const router = express.Router();
const apiService = require('../services/api.service');

// Import all controllers
const btcController = require('../controllers/btc.controller');
const ethController = require('../controllers/eth.controller');
const bscController = require('../controllers/bsc.controller');
const solController = require('../controllers/sol.controller');
const xrpController = require('../controllers/xrp.controller');
const adaController = require('../controllers/ada.controller');
const dogeController = require('../controllers/doge.controller');
const ltcController = require('../controllers/ltc.controller');
const trxController = require('../controllers/trx.controller');
const dotController = require('../controllers/dot.controller');
const avaxController = require('../controllers/avax.controller');
const maticController = require('../controllers/matic.controller');
const xlmController = require('../controllers/xlm.controller');
const atomController = require('../controllers/atom.controller');
const linkController = require('../controllers/link.controller');
const bnbController = require('../controllers/bnb.controller');

// Controller mapping
const controllers = {
  btc: btcController,
  eth: ethController,
  bsc: bscController,
  sol: solController,
  xrp: xrpController,
  ada: adaController,
  doge: dogeController,
  ltc: ltcController,
  trx: trxController,
  dot: dotController,
  avax: avaxController,
  matic: maticController,
  xlm: xlmController,
  atom: atomController,
  link: linkController,
  bnb: bnbController
};

// Get balance for a specific blockchain
router.get('/balance', async (req, res) => {
  try {
    const { blockchain, address, currency = 'USD' } = req.query;
    
    if (!blockchain || !address) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required parameters: blockchain and address' 
      });
    }

    const blockchainLower = blockchain.toLowerCase();
    const controller = controllers[blockchainLower];
    
    if (!controller) {
      return res.status(400).json({ 
        success: false,
        error: `Unsupported blockchain: ${blockchain}`,
        supportedBlockchains: Object.keys(controllers)
      });
    }

    // Get balance from controller
    const balanceResult = await controller.getBalance(address);
    
    if (!balanceResult.success) {
      return res.status(500).json(balanceResult);
    }

    // Get exchange rates
    const exchangeRates = await apiService.getExchangeRates();
    const rates = exchangeRates.data[blockchainLower] || { usd: 0, eur: 0, idr: 0 };
    
    // Calculate value in requested currency
    const currencyLower = currency.toLowerCase();
    const exchangeRate = rates[currencyLower] || rates.usd || 0;
    const value = balanceResult.balance * exchangeRate;

    res.json({
      success: true,
      blockchain: blockchainLower,
      address: address,
      balance: balanceResult.balance,
      currency: currency.toUpperCase(),
      exchangeRate: exchangeRate,
      value: value,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Balance route error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error while fetching balance',
      message: error.message
    });
  }
});

// Get balances for multiple addresses
router.post('/balances', async (req, res) => {
  try {
    const { addresses, currency = 'USD' } = req.body;
    
    if (!addresses || typeof addresses !== 'object') {
      return res.status(400).json({ 
        success: false,
        error: 'Missing or invalid addresses object' 
      });
    }

    const results = {};
    const promises = [];

    // Create promises for all balance requests
    for (const [blockchain, address] of Object.entries(addresses)) {
      const blockchainLower = blockchain.toLowerCase();
      const controller = controllers[blockchainLower];
      
      if (controller && address && address !== 'Not generated') {
        promises.push(
          controller.getBalance(address)
            .then(result => ({ blockchain: blockchainLower, result }))
            .catch(error => ({ blockchain: blockchainLower, result: { success: false, error: error.message } }))
        );
      } else {
        results[blockchainLower] = {
          success: false,
          balance: 0,
          error: controller ? 'Invalid address' : 'Unsupported blockchain'
        };
      }
    }

    // Wait for all balance requests to complete
    const balanceResults = await Promise.all(promises);
    
    // Process results
    for (const { blockchain, result } of balanceResults) {
      results[blockchain] = result;
    }

    // Get exchange rates
    const exchangeRates = await apiService.getExchangeRates();
    
    // Calculate values in requested currency
    let totalValue = 0;
    const currencyLower = currency.toLowerCase();
    
    for (const [blockchain, balanceData] of Object.entries(results)) {
      if (balanceData.success) {
        const rates = exchangeRates.data[blockchain] || { usd: 0, eur: 0, idr: 0 };
        const exchangeRate = rates[currencyLower] || rates.usd || 0;
        const value = balanceData.balance * exchangeRate;
        
        balanceData.exchangeRate = exchangeRate;
        balanceData.value = value;
        balanceData.currency = currency.toUpperCase();
        
        totalValue += value;
      }
    }

    res.json({
      success: true,
      balances: results,
      totalValue: totalValue,
      currency: currency.toUpperCase(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Balances route error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error while fetching balances',
      message: error.message
    });
  }
});

// Get exchange rates
router.get('/exchange-rates', async (req, res) => {
  try {
    const exchangeRates = await apiService.getExchangeRates();
    res.json(exchangeRates);
  } catch (error) {
    console.error('Exchange rates route error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch exchange rates',
      message: error.message
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const apiHealth = await apiService.checkApiHealth();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy', // Add actual database check if you have one
        apis: apiHealth
      },
      supportedBlockchains: Object.keys(controllers),
      version: '1.0.0'
    };

    // Check if any critical APIs are down
    const unhealthyApis = apiHealth.filter(api => api.status === 'unhealthy');
    if (unhealthyApis.length > 0) {
      healthStatus.status = 'degraded';
      healthStatus.warnings = `${unhealthyApis.length} external APIs are unhealthy`;
    }

    res.json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get supported blockchains
router.get('/blockchains', (req, res) => {
  const blockchains = Object.keys(controllers).map(key => ({
    id: key,
    name: key.toUpperCase(),
    supported: true
  }));

  res.json({
    success: true,
    blockchains: blockchains,
    count: blockchains.length
  });
});

// Validate address format (basic validation)
router.post('/validate-address', (req, res) => {
  try {
    const { blockchain, address } = req.body;
    
    if (!blockchain || !address) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing blockchain or address parameter' 
      });
    }

    const blockchainLower = blockchain.toLowerCase();
    const controller = controllers[blockchainLower];
    
    if (!controller) {
      return res.status(400).json({ 
        success: false,
        error: `Unsupported blockchain: ${blockchain}` 
      });
    }

    // Basic address validation (can be enhanced with proper validation logic)
    const isValid = address && 
                   address.length > 10 && 
                   address !== 'Not generated' && 
                   !address.includes('Error');

    res.json({
      success: true,
      blockchain: blockchainLower,
      address: address,
      isValid: isValid,
      format: isValid ? 'valid' : 'invalid'
    });
  } catch (error) {
    console.error('Address validation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to validate address',
      message: error.message
    });
  }
});

module.exports = router;