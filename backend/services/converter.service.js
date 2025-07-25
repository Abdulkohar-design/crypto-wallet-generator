exports.convertToCurrency = (amount, blockchain, currency, exchangeRates) => {
  if (!exchangeRates[blockchain] || !exchangeRates[blockchain][currency.toLowerCase()]) {
    return 0;
  }
  
  const rate = exchangeRates[blockchain][currency.toLowerCase()];
  return amount * rate;
};

exports.formatCurrency = (value, currency) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(value);
};