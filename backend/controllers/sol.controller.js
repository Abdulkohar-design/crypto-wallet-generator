const axios = require('axios');
const { handleApiError } = require('../services/api.service');

exports.getBalance = async (address) => {
  try {
    const response = await axios.get(
      `https://api.solscan.io/account?address=${address}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.data.data) {
      throw new Error('Solana account not found');
    }
    
    return response.data.data.lamports / 1e9; // Convert lamports to SOL
  } catch (error) {
    handleApiError('SOL', error);
    return 0;
  }
};