import isEmpty from 'lodash/isEmpty';

import {CrawlerProcessDtoFilter} from '../../../api/graphql/generated/graphql';
import {ACREAGE_ARRAY, PRICE_ARRAY} from '../../../assets/constants';
import {getDateBefore} from '../../../utils/TimerCommon';

// range giới hạn 1 năm.
const LIMIT_RANGE_DATE = 365;
// mặc định range 03 tháng.
const DEFAULT_RANGE_DATE = 30;

export const getRejectReasonCrawler = () => {
  return [
    {
      id: 'ec9922cd-3f50-418b-8c0f-ae87f6db06cf',
      key: 'Inappropriate',
      name: 'BĐS không phù hợp',
      checked: false,
    },
    {
      id: 'e43a1d4a-d82f-47a9-ab6f-c82e47faadf0',
      key: 'Sold',
      name: 'BĐS đã bán / không còn giao dịch',
      checked: false,
    },
    {
      id: '58cf08b5-7c75-4e16-91bb-88f14e1c5ca1',
      key: 'OwnerRefuse',
      name: 'Chủ tin đăng không đồng ý',
      checked: false,
    },
    {
      id: '1852ae89-c60d-431b-9b72-4dc34fae3a93',
      key: 'WrongInfo',
      name: 'Sai số điện thoại',
      checked: false,
    },
    {
      id: '496d0368-a64a-437d-b81a-ce56016b7786',
      key: 'Other',
      name: 'Khác',
      checked: false,
    },
  ];
};

/**
 * get list property types from masterData
 * @param {*} data masterData
 * @returns list property types mapping selected
 */
export const getPropertyTypes = data => {
  if (data?.propertyTypes?.edges) {
    return data.propertyTypes.edges.map(item => ({
      id: item.propertyTypeId,
      name: item.propertyTypeDescription,
      checked: false,
    }));
  }
  return [];
};

export const getAcreageRange = () => {
  return ACREAGE_ARRAY.map((item, index) => {
    return {...item, id: index, checked: false};
  });
};

export const getPriceRange = () => {
  return PRICE_ARRAY.map((item, index) => {
    return {...item, id: index, checked: false};
  });
};

const getInitialFilterData = () => {
  return {
    fromDate: getDateBefore(DEFAULT_RANGE_DATE).toISOString(),
    toDate: new Date().toISOString(),
    propertyTypes: [],
    districtIds: [],
    cityId: 0,
    acreageRange: null,
    priceRange: null,
  };
};

const getFilterByState = (filterOption, keywords) => {
  // filter propertyTypes
  const hasSelectedType = filterOption?.propertyTypes?.length > 0;
  const propertyTypesFilter = hasSelectedType && {
    propertyTypeId_in: filterOption?.propertyTypes,
  };

  // filter area city
  const city =
    !filterOption?.cityId || filterOption?.cityId === 0 ? null : {cityId: filterOption?.cityId};
  const districtIds =
    filterOption?.districtIds?.length > 0
      ? {OR: filterOption?.districtIds?.map(e => ({districtId: e.id}))}
      : null;

  const priceRange = filterOption?.priceRangeValue;
  const areaTotalRange = filterOption?.acreageRangeValue;

  const searchCriteria: CrawlerProcessDtoFilter = {
    ...propertyTypesFilter,
    ...city,
    ...districtIds,
    ...(priceRange && {
      price_gte: priceRange[0],
      price_lte: priceRange[1],
    }),
    ...(areaTotalRange && {
      areaTotal_gte: areaTotalRange[0],
      areaTotal_lte: areaTotalRange[1],
    }),
  };
  return {
    ...(!isEmpty(searchCriteria) && {filter: searchCriteria}),
    ...(!!String(keywords).trim() && {keywords: String(keywords).trim()}),
  };
};

const CrawlerFilterUtil = {
  getInitialFilterData,
  getFilterByState,
  LIMIT_RANGE_DATE,
};

export default CrawlerFilterUtil;
