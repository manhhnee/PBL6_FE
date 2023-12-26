// currencyConverter.js
import axios from 'axios';

const appId = '475ac6517d8f471a8e77d8ff685178ba'; // Replace with your API key
const baseCurrency = 'VND';
const targetCurrency = 'USD';

// Function to convert an amount from the base currency to the target currency
async function convertCurrency(amount) {
  try {
    const response = await axios.get(
      `https://open.er-api.com/v6/latest/${baseCurrency}?symbols=${targetCurrency}&apikey=${appId}`,
    );

    const exchangeRate = response.data.rates[targetCurrency];
    const convertedAmount = amount * exchangeRate;

    const formattedAmount = convertedAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return formattedAmount;
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    throw error; // Re-throw the error to handle it where the function is called
  }
}

export default convertCurrency;
