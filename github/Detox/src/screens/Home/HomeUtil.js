import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import JsonDataUtils from '../../utils/JsonDataUtils';

export const MAX_PROJECT_NUMBER = 10;
export const MAX_PROPERTY_NUMBER = 15;
export const DEFAULT_REFUND_RATE = '1%';

const pageSize = 1;
const orderBy = 'LATEST';

export const BINH_DINH_ID = 25;

export const getCities = () => {
  return {
    HCM: {
      cityId: 1,
      cityName: translate(STRINGS.HCM),
      image: IMAGES.HCM,
      totalCount: 0,
    },
    HN: {
      cityId: 2,
      cityName: translate(STRINGS.HN),
      image: IMAGES.HA_NOI,
      totalCount: 0,
    },
    DN: {
      cityId: 3,
      cityName: translate(STRINGS.DN),
      image: IMAGES.DA_NANG,
      totalCount: 0,
    },
    QN: {
      cityId: BINH_DINH_ID,
      cityName: translate(STRINGS.QN),
      districtId: 343,
      image: IMAGES.QUY_NHON,
      totalCount: 0,
    },
  };
};

export const getPropertySearchInput = (city, approvalStatusIds) => {
  const district = city.districtId ? [city.districtId] : [];
  return {
    pageSize,
    orderBy,
    placeJson: JsonDataUtils.stringifyJSONObject([{CityId: city.cityId, DistrictIds: district}]),
    propertyPostApprovalStatusJson: JsonDataUtils.stringifyJSONArray(approvalStatusIds),
  };
};

const getBaseQueryOptions = input => {
  return {
    variables: {
      input,
    },
  };
};

export const getHotProjectsQueryOptions = () => {
  return getBaseQueryOptions({
    page: 1,
    pageSize: 10,
    orderBy: 'HOTPRIORITY',
  });
};

export const getNewPropertiesQueryOptions = () => {
  return getBaseQueryOptions({
    page: 1,
    pageSize: 8,
    orderBy: 'AGENTRANKING',
  });
};
