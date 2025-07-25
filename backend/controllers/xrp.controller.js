const axios = require('axios');
const { handleApiError } = require('../services/api.service');

exports.getBalance = async (address) => {
  try {
    const response = await axios.get(
      `https://data.xrplmeta.org/account/${address}`
    );
    
    if (!response.data.balance) {
      throw new Error('XRP account not found');
    }
    
    return parseInt(response.data.balance) / 1e6; // Convert drops to XRP
  } catch (error) {
    handleApiError('XRP', error);
    return 0;
  }
};