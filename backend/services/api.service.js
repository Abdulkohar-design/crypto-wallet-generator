const axios = require('axios');

// Enhanced API service with better error handling and retry logic
class ApiService {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  async handleApiError(blockchain, error) {
    console.error(`${blockchain} API Error:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });

    // Return a structured error object
    return {
      success: false,
      error: error.message,
      status: error.response?.status || 500,
      blockchain
    };
  }

  async makeRequest(url, options = {}, attempt = 1) {
    try {
      const response = await axios({
        url,
        timeout: 10000,
        ...options
      });
      
      return response.data;
    } catch (error) {
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        console.log(`Retrying request to ${url}, attempt ${attempt + 1}`);
        await this.delay(this.retryDelay * attempt);
        return this.makeRequest(url, options, attempt + 1);
      }
      throw error;
    }
  }

  shouldRetry(error) {
    // Retry on network errors or 5xx status codes
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getExchangeRates() {
    try {
      const coinIds = [
        'bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple', 'cardano',
        'dogecoin', 'litecoin', 'tron', 'polkadot', 'avalanche-2', 'matic-network',
        'stellar', 'cosmos', 'chainlink'
      ].join(',');

      const response = await this.makeRequest(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd,eur,idr`
      );

      // Map coin IDs to our blockchain identifiers
      const mappedRates = {
        btc: response.bitcoin || { usd: 0, eur: 0, idr: 0 },
        eth: response.ethereum || { usd: 0, eur: 0, idr: 0 },
        bsc: response.binancecoin || { usd: 0, eur: 0, idr: 0 },
        sol: response.solana || { usd: 0, eur: 0, idr: 0 },
        xrp: response.ripple || { usd: 0, eur: 0, idr: 0 },
        ada: response.cardano || { usd: 0, eur: 0, idr: 0 },
        doge: response.dogecoin || { usd: 0, eur: 0, idr: 0 },
        ltc: response.litecoin || { usd: 0, eur: 0, idr: 0 },
        trx: response.tron || { usd: 0, eur: 0, idr: 0 },
        dot: response.polkadot || { usd: 0, eur: 0, idr: 0 },
        avax: response['avalanche-2'] || { usd: 0, eur: 0, idr: 0 },
        matic: response['matic-network'] || { usd: 0, eur: 0, idr: 0 },
        xlm: response.stellar || { usd: 0, eur: 0, idr: 0 },
        atom: response.cosmos || { usd: 0, eur: 0, idr: 0 },
        link: response.chainlink || { usd: 0, eur: 0, idr: 0 },
        bnb: response.binancecoin || { usd: 0, eur: 0, idr: 0 }
      };

      return {
        success: true,
        data: mappedRates,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Exchange rate API error:', error.message);
      
      // Return fallback rates if API fails
      return {
        success: false,
        error: 'Failed to fetch exchange rates',
        data: this.getFallbackRates(),
        timestamp: new Date().toISOString()
      };
    }
  }

  getFallbackRates() {
    // Fallback exchange rates (should be updated regularly in production)
    return {
      btc: { usd: 45000, eur: 38250, idr: 675000000 },
      eth: { usd: 2500, eur: 2125, idr: 37500000 },
      bsc: { usd: 300, eur: 255, idr: 4500000 },
      sol: { usd: 100, eur: 85, idr: 1500000 },
      xrp: { usd: 0.5, eur: 0.425, idr: 7500 },
      ada: { usd: 0.4, eur: 0.34, idr: 6000 },
      doge: { usd: 0.08, eur: 0.068, idr: 1200 },
      ltc: { usd: 70, eur: 59.5, idr: 1050000 },
      trx: { usd: 0.1, eur: 0.085, idr: 1500 },
      dot: { usd: 6, eur: 5.1, idr: 90000 },
      avax: { usd: 20, eur: 17, idr: 300000 },
      matic: { usd: 0.8, eur: 0.68, idr: 12000 },
      xlm: { usd: 0.1, eur: 0.085, idr: 1500 },
      atom: { usd: 10, eur: 8.5, idr: 150000 },
      link: { usd: 15, eur: 12.75, idr: 225000 },
      bnb: { usd: 300, eur: 255, idr: 4500000 }
    };
  }

  // Generic balance fetcher with proper error handling
  async fetchBalance(blockchain, address, apiConfig) {
    try {
      if (!address || address === 'Not generated' || address.includes('Error')) {
        return { success: false, balance: 0, error: 'Invalid address' };
      }

      const response = await this.makeRequest(apiConfig.url, {
        headers: apiConfig.headers || {},
        params: apiConfig.params || {}
      });

      const balance = this.extractBalance(response, apiConfig.balancePath, apiConfig.divisor);
      
      return {
        success: true,
        balance: balance,
        address: address,
        blockchain: blockchain,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching ${blockchain} balance:`, error.message);
      return {
        success: false,
        balance: 0,
        error: error.message,
        address: address,
        blockchain: blockchain
      };
    }
  }

  extractBalance(response, balancePath, divisor = 1) {
    try {
      // Navigate through nested object properties
      let balance = response;
      const pathArray = balancePath.split('.');
      
      for (const key of pathArray) {
        if (balance && typeof balance === 'object' && key in balance) {
          balance = balance[key];
        } else {
          return 0;
        }
      }

      // Convert to number and apply divisor
      const numericBalance = parseFloat(balance) || 0;
      return numericBalance / divisor;
    } catch (error) {
      console.error('Error extracting balance:', error);
      return 0;
    }
  }

  // Health check for external APIs
  async checkApiHealth() {
    const apis = [
      { name: 'CoinGecko', url: 'https://api.coingecko.com/api/v3/ping' },
      { name: 'Blockchair', url: 'https://api.blockchair.com/bitcoin/stats' },
      { name: 'Etherscan', url: 'https://api.etherscan.io/api?module=stats&action=ethsupply' }
    ];

    const results = await Promise.allSettled(
      apis.map(async (api) => {
        try {
          await this.makeRequest(api.url, { timeout: 5000 });
          return { name: api.name, status: 'healthy' };
        } catch (error) {
          return { name: api.name, status: 'unhealthy', error: error.message };
        }
      })
    );

    return results.map(result => result.value);
  }
}

module.exports = new ApiService();