import currency from 'currency.js';

export const stringToFloat = (value: string): number => {
  if (isNaN(parseFloat(value))) {
    const currencyFormatted = currency(value.replace(' ', ''), {
      symbol: 'R$',
      separator: '.',
      decimal: ',',
      precision: 2,
    });

    return currencyFormatted.value;
  }
  return parseFloat(value);
};
