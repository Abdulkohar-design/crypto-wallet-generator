const axios = require('axios');
const Web3 = require('web3');
const { handleApiError } = require('../services/api.service');

// Inisialisasi Web3 dengan RPC publik
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_RPC_URL));

exports.getBalance = async (address) => {
  try {
    // Validasi alamat Ethereum
    if (!web3.utils.isAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }
    
    // Dapatkan saldo dalam wei
    const balanceWei = await web3.eth.getBalance(address);
    
    // Konversi wei ke ETH
    return web3.utils.fromWei(balanceWei, 'ether');
  } catch (error) {
    handleApiError('ETH', error);
    return 0;
  }
};

exports.getGasPrice = async () => {
  try {
    return await web3.eth.getGasPrice();
  } catch (error) {
    handleApiError('ETH Gas', error);
    return '0';
  }
};

exports.getTransactionCount = async (address) => {
  try {
    return await web3.eth.getTransactionCount(address);
  } catch (error) {
    handleApiError('ETH TxCount', error);
    return 0;
  }
};