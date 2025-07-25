const axios = require('axios');
const { handleApiError } = require('../services/api.service');

exports.getBalance = async (address) => {
  try {
    const response = await axios.get(
      `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.BSCSCAN_API_KEY}`
    );
    
    if (response.data.status !== "1") {
      throw new Error(response.data.message || 'BscScan API error');
    }
    
    return parseInt(response.data.result) / 1e18; // Convert wei to BNB
  } catch (error) {
    handleApiError('BSC', error);
    return 0;
  }
};