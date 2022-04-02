import currency from 'currency.js';

const real = (value: any) =>
  currency(value, { symbol: 'R$', separator: '.', decimal: ',', precision: 2 });

export const stringToFloat = (value: string): number => {
  const number = currency(value.replace(/[^\d]/g, ''), {
    fromCents: true,
    precision: 2,
  });
  if (!isNaN(number.value)) {
    return number.value;
  }

  return null;
};

export const currencyToDecimal = (string: any): any => {
  if (string) {
    return real(string);
  }
  return null;
};
