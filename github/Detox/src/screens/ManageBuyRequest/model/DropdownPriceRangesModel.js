import {CONTACT_TRADING_TYPE} from '../../../assets/constants';

const buyRequestPriceRanges = [
  {
    id: 0,
    name: '< 500 triệu',
    fromValue: 1000,
    toValue: 500000000,
    checked: false,
  },
  {
    id: 1,
    name: '500 triệu - 1 tỷ',
    fromValue: 500000000,
    toValue: 1000000000,
    checked: false,
  },
  {
    id: 2,
    name: '1-3 tỷ',
    fromValue: 1000000000,
    toValue: 3000000000,
    checked: false,
  },
  {
    id: 3,
    name: '3-5 tỷ',
    fromValue: 3000000000,
    toValue: 5000000000,
    checked: false,
  },
  {
    id: 4,
    name: '5-7 tỷ',
    fromValue: 5000000000,
    toValue: 7000000000,
    checked: false,
  },
  {
    id: 5,
    name: '7-10 tỷ',
    fromValue: 7000000000,
    toValue: 10000000000,
    checked: false,
  },
  {
    id: 6,
    name: 'Trên 10 tỷ',
    fromValue: 10000000000,
    toValue: null,
    checked: false,
  },
  {
    id: 7,
    name: 'Thoả thuận',
    fromValue: 0,
    toValue: 0,
    checked: false,
  },
  {
    id: 8,
    name: 'Khác',
    fromValue: 0,
    toValue: 0,
    checked: false,
  },
];

const rentalRequestPriceRanges = [
  {
    id: 0,
    name: '< 3 triệu',
    fromValue: 0,
    toValue: 3000000,
    checked: false,
  },
  {
    id: 1,
    name: '3-5 triệu',
    fromValue: 3000000,
    toValue: 5000000,
    checked: false,
  },
  {
    id: 2,
    name: '5-10 triệu',
    fromValue: 5000000,
    toValue: 10000000,
    checked: false,
  },
  {
    id: 3,
    name: '10-20 triệu',
    fromValue: 10000000,
    toValue: 20000000,
    checked: false,
  },
  {
    id: 4,
    name: '20-40 triệu',
    fromValue: 20000000,
    toValue: 40000000,
    checked: false,
  },
  {
    id: 5,
    name: '40-60 triệu',
    fromValue: 40000000,
    toValue: 60000000,
    checked: false,
  },
  {
    id: 6,
    name: '60-100 triệu',
    fromValue: 60000000,
    toValue: 100000000,
    checked: false,
  },
  {
    id: 7,
    name: 'Trên 100 triệu',
    fromValue: 100000000,
    toValue: null,
    checked: false,
  },
  {
    id: 8,
    name: 'Khác',
    fromValue: 0,
    toValue: 0,
    checked: false,
  },
];

const DROPDOWN_PRICE_RANGES_MODEL = contactType => {
  const isBuyRequest = contactType === CONTACT_TRADING_TYPE.BUY;
  const requestInfo = isBuyRequest
    ? buyRequestPriceRanges.map(e => ({...e}))
    : rentalRequestPriceRanges.map(e => ({...e}));
  return requestInfo;
};

export {DROPDOWN_PRICE_RANGES_MODEL};
