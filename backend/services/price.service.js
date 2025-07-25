const axios = require('axios');

const COINGECKO_API_URL = process.env.COINGECKO_API_URL;

exports.getCryptoPrice = async (coinId, currency = 'usd') => {
  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}simple/price?ids=${coinId}&vs_currencies=${currency}`
    );
    
    return response.data[coinId][currency];
  } catch (error) {
    console.error('CoinGecko API Error:', error.message);
    return null;
  }
};

exports.getMultipleCryptoPrices = async (coinIds, currency = 'usd') => {
  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}simple/price?ids=${coinIds.join(',')}&vs_currencies=${currency}`
    );
    
    return response.data;
  } catch (error) {
    console.error('CoinGecko API Error:', error.message);
    return {};
  }
};

exports.getHistoricalPrice = async (coinId, currency = 'usd', date) => {
  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}coins/${coinId}/history?date=${date}`
    );
    
    return response.data.market_data.current_price[currency];
  } catch (error) {
    console.error('CoinGecko History API Error:', error.message);
    return null;
  }
};