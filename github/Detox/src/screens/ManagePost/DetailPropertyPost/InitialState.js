import {STRINGS} from '../../../assets/localize/string';

const commonData = {
  [STRINGS.PROPERTY_STATUS]: '',
  [STRINGS.LEGAL_STATUS]: '',
  [STRINGS.WIDTH]: '',
  [STRINGS.LENGTH]: '',
  [STRINGS.DIRECTION]: '',
  [STRINGS.NUMBER_OF_FLOOR]: 1,
};

const apartmentData = {
  ...commonData,
  [STRINGS.TOWER]: '',
  [STRINGS.FLOOR]: '',
  [STRINGS.LAND_ACREAGE]: '',
  [STRINGS.NUMBER_OF_BATHROOM]: 1,
  [STRINGS.NUMBER_OF_BEDROOM]: 1,
  [STRINGS.BALCONY_DIRECTION]: '',
};

const villaData = {
  ...commonData,
  [STRINGS.LAND_ACREAGE]: '',
  [STRINGS.USAGE_ACREAGE]: '',
  [STRINGS.NUMBER_OF_BATHROOM]: 1,
  [STRINGS.NUMBER_OF_BEDROOM]: 1,
  [STRINGS.NUMBER_OF_FLOOR]: 1,
  propertyLocation: null,
};

const houseData = {
  ...commonData,
  [STRINGS.LAND_ACREAGE]: '',
  [STRINGS.USAGE_ACREAGE]: '',
  [STRINGS.NUMBER_OF_BATHROOM]: 1,
  [STRINGS.NUMBER_OF_BEDROOM]: 1,
  [STRINGS.NUMBER_OF_FLOOR]: 1,
  propertyLocation: null,
};

const landData = {
  ...commonData,
  [STRINGS.LAND_ACREAGE]: '',
  propertyLocation: null,
};

export default {
  apartmentData,
  villaData,
  houseData,
  landData,
};
