import {CONSTANTS} from '../../../../assets/constants';

export const aquareArray = [
  {
    name: '<= 30 m2',
    value: [0, 30],
  },
  {
    name: '30 - 50 m2',
    value: [30, 50],
  },
  {
    name: '50 - 100 m2',
    value: [50, 100],
  },
  {
    name: '100 - 200 m2',
    value: [100, 200],
  },
  {
    name: '200 - 500 m2',
    value: [200, 500],
  },
  {
    name: '> 500 m2',
    value: [500, null],
  },
];

export const RENTAL_PRICE_RANGE_LIST = [
  {
    name: '< 3 triệu',
    value: [0, 3 * CONSTANTS.MILLION],
  },
  {
    name: '3-5 triệu',
    value: [3 * CONSTANTS.MILLION, 5 * CONSTANTS.MILLION],
  },
  {
    name: '5-10 triệu',
    value: [5 * CONSTANTS.MILLION, 10 * CONSTANTS.MILLION],
  },
  {
    name: '10-20 triệu',
    value: [10 * CONSTANTS.MILLION, 20 * CONSTANTS.MILLION],
  },
  {
    name: '20-40 triệu',
    value: [20 * CONSTANTS.MILLION, 40 * CONSTANTS.MILLION],
  },
  {
    name: '40-60 triệu',
    value: [40 * CONSTANTS.MILLION, 60 * CONSTANTS.MILLION],
  },
  {
    name: '60-100 triệu',
    value: [60 * CONSTANTS.MILLION, 100 * CONSTANTS.MILLION],
  },
  {
    name: 'Trên 100 triệu',
    value: [100 * CONSTANTS.MILLION, null],
  },
];
