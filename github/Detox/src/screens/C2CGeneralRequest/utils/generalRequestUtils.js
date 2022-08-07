import moment from 'moment';

import {C2CDemandDto} from '../../../api/graphql/generated/graphql';
import {CONSTANTS, MAP_PROPERTY, SORT_ORDER} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import MeasureUtils from '../../../utils/MeasureUtils';
import NumberUtils from '../../../utils/NumberUtils';
import {dateToTimestamp, formatTimeToTimeDate} from '../../../utils/TimerCommon';
import {ServiceType} from '../constants';

const MIN_PRICE = 0;
const MIN_SQUARE = 0;

export type GeneralRequest = C2CDemandDto & {
  createdDatetime: string,
  contactType: string,
  propertyTypeName: string,
  areas: string,
  priceRange: string,
  squareRange: string,
};

const mappingRangePrice = ([from, to]) => {
  if (!from && !to) {
    return null;
  }
  return JSON.stringify({
    PriceFrom: from && from > MIN_PRICE ? from : MIN_PRICE,
    PriceTo: to && to > 0 ? to : CONSTANTS.MAX_PRICE_VALUE,
  });
};

const mappingRangeSquares = ([from, to]) => {
  if (!from && !to) {
    return null;
  }
  return JSON.stringify({
    SquareFrom: from && from > MIN_SQUARE ? from : MIN_SQUARE,
    SquareTo: to && to > 0 ? to : CONSTANTS.MAX_ACREAGE_VALUE,
  });
};

const buildCommonQueryVariables = data => {
  const {
    title,
    servicePostType,
    propertyLocation,
    price,
    square,
    numberOfBathrooms,
    numberOfBedrooms,
    direction,
    propertyTypeId,
    projectId,
    place,
  } = data;
  const cityId = place?.city?.id;
  const cityName = place?.city?.name;
  const districts = place?.districts?.map(d => ({districtName: d?.name, districtId: d?.id}));
  return {
    title,
    forSale: servicePostType === ServiceType.BUY,
    placeJson: JSON.stringify({
      cityName,
      cityId,
      districts,
    }),
    priceRangeJson: mappingRangePrice([price.priceRangeFrom, price.priceRangeTo]),
    squareRangeJson: mappingRangeSquares([square.squareRangeFrom, square.squareRangeTo]),
    numberOfBathrooms: numberOfBathrooms ? Number(numberOfBathrooms) : null,
    numberOfBedrooms: numberOfBedrooms ? Number(numberOfBedrooms) : null,
    directionJson:
      direction && direction.length > 0
        ? JSON.stringify(
            direction.map(x => ({
              Direction: x,
            })),
          )
        : null,
    propertyTypeId: propertyTypeId ? propertyTypeId : null,
    propertyLocation: propertyLocation ? propertyLocation : 'UNDEFINED',
    projectId: projectId ? projectId : null,
  };
};

export const buildCreateQueryVariables = data => {
  const {requesterIsBuyer, requesterFullName, requesterPhone, requesterEmail, tokenCaptcha} = data;
  const commonQuery = buildCommonQueryVariables(data);
  return {
    ...commonQuery,
    requesterIsBuyer,
    requesterFullName: requesterFullName.trim(),
    requesterPhone,
    requesterEmail,
    tokenCaptcha,
  };
};

export const buildUpdateQueryVariables = data => {
  const {c2CDemandId} = data;
  const commonQuery = buildCommonQueryVariables(data);
  return {
    c2CDemandId,
    ...commonQuery,
  };
};

export const mapGeneralRequestItem = (item): GeneralRequest => {
  if (!item) return null;
  return {
    ...item,
    createdDatetime: formatTimeToTimeDate(item?.createdDatetime),
    contactType: item?.forSale
      ? translate('c2CGeneralRequest.buy')
      : translate('c2CGeneralRequest.rent'),
    propertyTypeName: MAP_PROPERTY[item?.propertyTypeName]?.name,
    areas: item?.placeDto?.districts[0].districtName + ', ' + item?.placeDto?.cityName,
    priceRange: formatPriceRange(item?.priceRangeDto?.priceFrom, item?.priceRangeDto?.priceTo),
    squareRange: formatSquareRange(
      item?.squareRangeDto?.squareFrom,
      item?.squareRangeDto?.squareTo,
    ),
  };
};

export const buildQueryFilter = (filterState, keyword) => {
  const {placeJson, propertyTypeJson} = filterState || {};
  const {city} = placeJson || {};
  const cityId = city?.id;
  const cityName = city?.name;
  const districts = placeJson?.districts?.map(d => ({districtName: d?.name, districtId: d?.id}));
  return {
    order_by: {
      createdDatetime: SORT_ORDER.DESC,
    },
    page: 1,
    pageSize: 10,
    request: {
      forSale: filterState?.forSale === null ? null : filterState?.forSale,
      keyword,
      placeJson: city?.id
        ? JSON.stringify({
            cityName,
            cityId,
            districts,
          })
        : null,
      propertyTypeJson:
        propertyTypeJson && propertyTypeJson?.length > 0 ? JSON.stringify(propertyTypeJson) : null,
    },
    where: {
      createdDatetime_gte: dateToTimestamp(
        new Date(moment(filterState?.fromDate).startOf(CONSTANTS.DAY)),
      ),
      createdDatetime_lte: dateToTimestamp(
        new Date(moment(filterState?.toDate).endOf(CONSTANTS.DAY)),
      ),
    },
  };
};

export const formatPriceRange = (priceFrom, priceTo) => {
  let price = '';
  if (!priceFrom && !priceTo) {
    price = translate(STRINGS.NEGOTIATE);
  } else {
    const from = priceFrom
      ? MeasureUtils.getPriceDescriptionNoUnitInput(priceFrom, 3, false)
      : translate('common.less') + ' ';
    const to = priceTo
      ? MeasureUtils.getPriceDescriptionNoUnitInput(priceTo, 3, false)
      : translate('common.greater') + ' ';
    price = priceTo ? (priceFrom ? from + ' - ' : from) + to : to + from;
  }
  return price;
};

export const formatSquareRange = (squareFrom, squareTo) => {
  let area = '';
  if (!squareFrom && !squareTo) {
    area = translate(STRINGS.NEGOTIATE);
  } else {
    const from = squareFrom
      ? `${NumberUtils.formatNumber(squareFrom)}`
      : translate('common.less') + ' ';
    const to = squareTo
      ? `${NumberUtils.formatNumber(squareTo)}`
      : translate('common.greater') + ' ';
    area = squareTo ? (squareFrom ? from + ' - ' : from) + to : to + from;
    area += ' m2';
  }
  return area;
};
