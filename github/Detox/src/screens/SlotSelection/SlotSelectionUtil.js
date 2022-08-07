import isEmpty from 'lodash/isEmpty';

import {Direction} from '../../api/graphql/generated/graphql';
import {
  CONSTANTS,
  getDirectionList,
  getRoomsList,
  SALE_TRACKING_STATUS,
} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';

export const DEFAULT_NUMBER_COLUMN = 2;

const resetDropdown = (it, index) => ({...it, checked: index === 0});

export const EMPTY_PROPERTY_STATUS = [
  SALE_TRACKING_STATUS.OPENING_DEPOSIT,
  SALE_TRACKING_STATUS.BOOKING,
];
export const BOOKED_PROPERTY_STATUS = [
  SALE_TRACKING_STATUS.BOOKED,
  SALE_TRACKING_STATUS.WAITING_DEPOSIT,
  SALE_TRACKING_STATUS.HOLD_PLACE,
];
export const SOLD_PROPERTY_STATUS = [
  SALE_TRACKING_STATUS.DEPOSIT_CONFIRMED,
  SALE_TRACKING_STATUS.SOLD,
  SALE_TRACKING_STATUS.PILE_OUTSIDE,
];

export const SLOT_SELECTION_TYPE = {
  NORMAL: 'NORMAL',
  TRANSFER_DEPOSIT: 'TRANSFER_DEPOSIT',
};

export const DirectionData = [
  {id: Direction.Null, name: translate(STRINGS.ALL), checked: true},
  ...getDirectionList(),
];

export const BathRoomData = [...getRoomsList()];

export const BedRoomData = [...getRoomsList()];

export const FilterComponentKey = {
  direction: 'direction',
  priceRange: 'priceRange',
  acreageRange: 'acreageRange',
  numberOfBedRooms: 'numberOfBedRooms',
  numberOfBathRooms: 'numberOfBathRooms',
  balconyDirection: 'balconyDirection', // Hướng ban công
};

export const getInitialFilterData = () => {
  return {
    bathRoomData: BathRoomData.map(resetDropdown),
    bedRoomData: BedRoomData.map(resetDropdown),
    directionsData: DirectionData.map(resetDropdown),
    direction: Direction.Null,
    priceRange: [null, null],
    acreageRange: [null, null],
    numberOfBathRooms: 0,
    numberOfBedRooms: 0,
    balconyDirectionsData: DirectionData.map(resetDropdown),
    balconyDirection: Direction.Null,
  };
};

export const FilterInitialState = {
  bathRoomData: BathRoomData,
  bedRoomData: BedRoomData,
  directionsData: DirectionData,
  direction: Direction.Null,
  priceRange: [0, CONSTANTS.MAX_PRICE_SLIDER],
  acreageRange: [0, CONSTANTS.MAX_ACREAGE],
  numberOfBedRooms: 0,
  numberOfBathRooms: 0,
};

const filterToQueryInput = filterData => {
  const fromPrice =
    filterData?.priceRange[0] && filterData?.priceRange[0] > 0 ? filterData?.priceRange[0] : 0;

  const toPrice =
    filterData?.priceRange[1] && filterData?.priceRange[1] > 0
      ? filterData?.priceRange[1]
      : CONSTANTS.MAX_PRICE_VALUE;

  const fromArea =
    filterData?.acreageRange[0] && filterData?.acreageRange[0] > 0
      ? filterData?.acreageRange[0]
      : 0;

  const toArea =
    filterData?.acreageRange[1] && filterData?.acreageRange[1] > 0
      ? filterData?.acreageRange[1]
      : CONSTANTS.MAX_ACREAGE;
  return {
    direction: filterData.direction,
    fromArea,
    toArea,
    fromPrice,
    toPrice,
    fromNumberOfBedrooms: filterData.numberOfBedRooms,
    fromNumberOfBathrooms: filterData.numberOfBathRooms,
    balconyDirection: filterData.balconyDirection,
  };
};

const propertyPostToRow = propertyPosts => {
  return chunkArray(propertyPosts, DEFAULT_NUMBER_COLUMN);
};

const propertyByStatusList = (properties, statusList) => {
  if (isEmpty(properties)) {
    return [];
  }
  if (isEmpty(statusList)) {
    return properties;
  }
  return properties.filter(it => statusList.includes(it.saleTrackingStatusName));
};

const extractFloorData = (allPropertyWithFloor, statusList) => {
  const floorData = [];
  if (!isEmpty(allPropertyWithFloor)) {
    allPropertyWithFloor.forEach(floorItem => {
      const properties = propertyByStatusList(floorItem.propertyPosts, statusList);
      if (!isEmpty(properties)) {
        const floorPlanPhoto = floorItem?.floorPlanPhoto;
        floorData.push({
          floor: floorItem.floor,
          floorPlanPhotos: floorPlanPhoto ? [floorPlanPhoto] : [],
          data: propertyPostToRow(properties),
          total: properties.length,
        });
      }
    });
  }
  return floorData;
};

const saleTrackingColor = saleTrackingName => {
  let color = COLORS.BLUE_90;
  let border = COLORS.BLUE_60;
  let propertyBackgroundColor = COLORS.BLUE_BASIC;
  let propertyTextColor = COLORS.NEUTRAL_WHITE;
  if (EMPTY_PROPERTY_STATUS.includes(saleTrackingName)) {
    color = COLORS.BLUE_90;
    border = COLORS.BLUE_60;
    propertyBackgroundColor = COLORS.BLUE_BASIC;
  } else if (BOOKED_PROPERTY_STATUS.includes(saleTrackingName)) {
    color = COLORS.ORANGE_90;
    border = COLORS.ORANGE_60;
    propertyBackgroundColor = COLORS.ORANGE_BASIC;
  } else if (SOLD_PROPERTY_STATUS.includes(saleTrackingName)) {
    color = COLORS.NEUTRAL_BACKGROUND;
    border = COLORS.NEUTRAL_BORDER;
    propertyBackgroundColor = COLORS.TEXT_GRAY_80;
    propertyTextColor = COLORS.TEXT_DARK_10;
  }
  return {color, border, propertyBackgroundColor, propertyTextColor};
};

const isDepositItem = saleTrackingName => {
  const {color} = saleTrackingColor(saleTrackingName);
  return color === COLORS.CIRCLE_DEPOSIT_BACKGROUND;
};

function chunkArray(myArray, chunk_size) {
  const tempArray = [...myArray];
  const results = [];

  while (tempArray.length) {
    results.push(tempArray.splice(0, chunk_size));
  }

  return results;
}

const SlotSelectionUtil = {
  saleTrackingColor,
  isDepositItem,
  filterToQueryInput,
  getInitialFilterData,
  extractFloorData,
};

export default SlotSelectionUtil;
