// @ts-ignore
import initials from 'initials';

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const formatPrice = (price: string | number) => {
  return `$${parseFloat(price.toString()).toFixed(2)}`;
};

export const formatCoin = (coins: number) => {
  return `${coins} ${coins > 1 ? 'coins' : 'coin'}`;
};

export function getInitialName(name: string) {
  return name
    ? name.split(' ').length == 1
      ? initials(name.toLowerCase())
          .toString()
          .toUpperCase()
      : charSymbol(name)
    : '';
}

const charSymbol = (name: string) => {
  const nameSplit = name.replace(/[^\w\s]/gi, '');
  let initials: any = nameSplit.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
};
