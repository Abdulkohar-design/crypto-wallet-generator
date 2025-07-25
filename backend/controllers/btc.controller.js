const axios = require('axios');
const { handleApiError } = require('../services/api.service');

exports.getBalance = async (address) => {
  try {
    const response = await axios.get(
      `https://api.blockchair.com/bitcoin/dashboards/address/${address}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.BLOCKCHAIR_API_KEY}`
        }
      }
    );
    
    if (!response.data.data[address]) {
      throw new Error('Bitcoin address not found');
    }
    
    return response.data.data[address].address.balance / 100000000; // Convert satoshi to BTC
  } catch (error) {
    handleApiError('BTC', error);
    return 0;
  }
};