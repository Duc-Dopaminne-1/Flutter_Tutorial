import {Direction} from '../../../api/graphql/generated/graphql';
import {CONTACT_TRADING_TYPE, PROPERTY_LOCATION} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';

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

export const locationTypes = [
  {
    id: PROPERTY_LOCATION.FRONTAGE,
    title: translate(STRINGS.TOWN_HOUSE),
    name: translate(STRINGS.TOWN_HOUSE),
    checked: false,
  },
  {
    id: PROPERTY_LOCATION.ALLEY,
    title: translate(STRINGS.ALLEY),
    name: translate(STRINGS.ALLEY),
    checked: false,
  },
];

export const ServiceType = {
  BUY: 'BUY',
  RENT: 'RENT',
};

export const getDirectionList = () => [
  {id: Direction.East, name: translate(STRINGS.EAST), checked: false},
  {id: Direction.West, name: translate(STRINGS.WEST), checked: false},
  {id: Direction.South, name: translate(STRINGS.SOUTH), checked: false},
  {id: Direction.North, name: translate(STRINGS.NORTH), checked: false},
  {id: Direction.Southeast, name: translate(STRINGS.SOUTHEAST), checked: false},
  {id: Direction.Northeast, name: translate(STRINGS.NORTHEAST), checked: false},
  {id: Direction.Southwest, name: translate(STRINGS.SOUTHWEST), checked: false},
  {id: Direction.Northwest, name: translate(STRINGS.NORTHWEST), checked: false},
];

export const getRoomsList = () => [
  {id: 0, name: translate(STRINGS.ALL), checked: true},
  {id: 1, name: '1+', checked: false},
  {id: 2, name: '2+', checked: false},
  {id: 3, name: '3+', checked: false},
  {id: 4, name: '4+', checked: false},
  {id: 5, name: '5+', checked: false},
];

export const GENERAL_REQUEST_TYPE = {
  INFORMATION: 'INFORMATION',
  RECENT: 'RECENT',
};

export const REQUEST_FOR_SALE_TYPES = [
  {
    id: CONTACT_TRADING_TYPE.ALL,
    name: 'Tất cả',
    checked: true,
    value: null,
  },
  {
    id: CONTACT_TRADING_TYPE.BUY,
    name: 'Mua',
    checked: false,
    value: true,
  },
  {
    id: CONTACT_TRADING_TYPE.RENT,
    name: 'Thuê',
    checked: false,
    value: false,
  },
];
