import isNumber from 'lodash/isNumber';

import {
  CONTACT_TRADING_TYPE,
  DAY_TO_MILISECOND,
  getDirectionList,
  REQUEST_STATUS_CODE,
} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import MeasureUtils from '../../utils/MeasureUtils';
import NumberUtils from '../../utils/NumberUtils';
import {DROPDOWN_AREA_MEASUREMENT_MODEL} from './model/DropdownAreaMeasurementModel';
import {DROPDOWN_PRICE_RANGES_MODEL} from './model/DropdownPriceRangesModel';

const DIRECTIONS = getDirectionList();

export const getColorByCode = value => {
  switch (value) {
    case REQUEST_STATUS_CODE.STATE_NEW:
      return COLORS.BOOKING_COMPLETED;
    case REQUEST_STATUS_CODE.STATE_IN_PROGRESS:
      return COLORS.PRIMARY_A100;
    case REQUEST_STATUS_CODE.STATE_DEPOSIT:
      return COLORS.BLUE_56;
    case REQUEST_STATUS_CODE.STATE_NEGOTIATE:
      return COLORS.ORANGE_3B;
    case REQUEST_STATUS_CODE.STATE_COMPLETED:
      return COLORS.GREEN_6FCF97;
    case REQUEST_STATUS_CODE.STATE_PENDING:
      return COLORS.STATE_ERROR;
    case REQUEST_STATUS_CODE.STATE_CLOSE:
      return COLORS.BRAND_GREY;
    case REQUEST_STATUS_CODE.STATE_PROCESSING:
      return COLORS.PRIMARY_A100;
    case REQUEST_STATUS_CODE.STATE_PROCESSED:
      return COLORS.BOOKING_COMPLETED;
  }
};

export const mapPriceToPriceRanges = (
  priceFrom,
  priceTo,
  contactType = CONTACT_TRADING_TYPE.BUY,
) => {
  const priceRangeOptions = DROPDOWN_PRICE_RANGES_MODEL(contactType);
  if (NumberUtils.isValidIntNumber(priceTo) && NumberUtils.parseIntValue(priceTo) > 0) {
    switch (true) {
      case priceTo <= priceRangeOptions[0].toValue:
        return {...priceRangeOptions[0]};
      case priceFrom >= priceRangeOptions[1].fromValue && priceTo <= priceRangeOptions[1].toValue:
        return {...priceRangeOptions[1]};
      case priceFrom >= priceRangeOptions[2].fromValue && priceTo <= priceRangeOptions[2].toValue:
        return {...priceRangeOptions[2]};
      case priceFrom >= priceRangeOptions[3].fromValue && priceTo <= priceRangeOptions[3].toValue:
        return {...priceRangeOptions[3]};
      case priceFrom >= priceRangeOptions[4].fromValue && priceTo <= priceRangeOptions[4].toValue:
        return {...priceRangeOptions[4]};
      case priceFrom >= priceRangeOptions[5].fromValue && priceTo <= priceRangeOptions[5].toValue:
        return {...priceRangeOptions[5]};
      case contactType === CONTACT_TRADING_TYPE.BUY && priceFrom >= priceRangeOptions[6].fromValue:
      case priceFrom >= priceRangeOptions[6].fromValue && priceTo <= priceRangeOptions[6].toValue:
        return {...priceRangeOptions[6]};
      case priceFrom >= priceRangeOptions[7].fromValue:
        return {...priceRangeOptions[7]};
      default:
        const priceDesFrom = MeasureUtils.getPriceDescriptionNoUnitInput(priceFrom);
        const priceDesTo = MeasureUtils.getPriceDescriptionNoUnitInput(priceTo);
        return {name: `${priceDesFrom} - ${priceDesTo}`, toValue: priceTo, fromValue: priceFrom};
    }
  }
  if (priceFrom) {
    switch (true) {
      case priceFrom <= priceRangeOptions[0].toValue:
        return {...priceRangeOptions[0]};
      case priceFrom >= priceRangeOptions[1].fromValue && priceFrom < priceRangeOptions[1].toValue:
        return {...priceRangeOptions[1]};
      case priceFrom >= priceRangeOptions[2].fromValue && priceFrom < priceRangeOptions[2].toValue:
        return {...priceRangeOptions[2]};
      case priceFrom >= priceRangeOptions[3].fromValue && priceFrom < priceRangeOptions[3].toValue:
        return {...priceRangeOptions[3]};
      case priceFrom >= priceRangeOptions[4].fromValue && priceFrom < priceRangeOptions[4].toValue:
        return {...priceRangeOptions[4]};
      case priceFrom >= priceRangeOptions[5].fromValue && priceFrom < priceRangeOptions[5].toValue:
        return {...priceRangeOptions[5]};
      case contactType === CONTACT_TRADING_TYPE.BUY && priceFrom >= priceRangeOptions[6].fromValue:
      case priceFrom >= priceRangeOptions[6].fromValue && priceFrom < priceRangeOptions[6].toValue:
        return {...priceRangeOptions[6]};
      case priceFrom >= priceRangeOptions[7].fromValue:
        return {...priceRangeOptions[7]};
      default:
        const priceDesFrom = MeasureUtils.getPriceDescriptionNoUnitInput(priceFrom);
        return {name: `${priceDesFrom}`, toValue: null, fromValue: priceFrom};
    }
  }
  return {name: translate('common.negotiate'), toValue: null, fromValue: null};
};

export const mapAreaToAreaOptions = (areaFrom, areaTo) => {
  const areaOptions = DROPDOWN_AREA_MEASUREMENT_MODEL();
  if (NumberUtils.isValidIntNumber(areaTo) && NumberUtils.parseIntValue(areaTo) > 0) {
    switch (true) {
      case areaTo <= 30:
        return {...areaOptions[0]};
      case areaFrom >= 30 && areaTo <= 50:
        return {...areaOptions[1]};
      case areaFrom >= 50 && areaTo <= 100:
        return {...areaOptions[2]};
      case areaFrom >= 100 && areaTo <= 200:
        return {...areaOptions[3]};
      case areaFrom >= 200 && areaTo <= 500:
        return {...areaOptions[4]};
      case areaFrom >= 500:
        return {...areaOptions[5]};
      default:
        return {
          name: `${areaFrom}-${MeasureUtils.getSquareMeterText(areaTo)}`,
          toValue: areaTo,
          fromValue: areaFrom,
        };
    }
  }
  if (areaFrom) {
    switch (true) {
      case areaFrom <= 30:
        return {...areaOptions[0]};
      case areaFrom >= 30 && areaFrom < 50:
        return {...areaOptions[1]};
      case areaFrom >= 50 && areaFrom < 100:
        return {...areaOptions[2]};
      case areaFrom >= 100 && areaFrom < 200:
        return {...areaOptions[3]};
      case areaFrom >= 200 && areaFrom < 500:
        return {...areaOptions[4]};
      case areaFrom >= 500:
        return {...areaOptions[5]};
      default:
        if (isNumber(areaFrom)) {
          return {
            name: `${MeasureUtils.getSquareMeterText(areaFrom)}`,
            toValue: null,
            fromValue: areaFrom,
          };
        }
        return {name: '-', toValue: null, fromValue: null};
    }
  }
  return {name: '-', toValue: null, fromValue: null};
};

export const convertDirections = directions => {
  return directions
    ? [
        ...directions.map(e => {
          let output = e;
          DIRECTIONS.forEach(e2 => {
            if (e === e2.id) {
              output = e2.name;
            }
          });
          return output;
        }),
      ]
    : [];
};

export const checkIfParamIsPositiveNumberElseReturnNull = param => {
  const parseFloatParam = parseFloat(param);
  if (!param || parseFloatParam < 0 || isNaN(parseFloatParam)) {
    return null;
  }
  return parseFloatParam;
};

export const checkIfParamIsPositiveNumberThenReturnStringParamElseReturn = param => {
  const parseFloatParam = parseFloat(param);
  if (!param || parseFloatParam < 0 || isNaN(parseFloatParam)) {
    return param;
  }
  return parseFloatParam.toString();
};

export const getPropertyTypeChoices = masterData => {
  const listPropertyTypes = masterData?.propertyTypes?.edges ?? [];
  const choices = listPropertyTypes.map(item => ({
    id: item.propertyTypeId,
    name: item.propertyTypeName,
    title: item.propertyTypeDescription,
    checked: false,
  }));

  return choices;
};

export const mapPropertyPost = (list = [], id, needOnlyOne = false) => {
  if (!id && list && list.length === 1) {
    // return when list has = 1 object and does not require mapping
    return list.map((e, index) => ({...e, checked: index === 0}));
  }
  if (!id && list && list.length > 1) {
    // return when list has > 1 objects and does not require mapping
    return list.map(e => ({...e, checked: false}));
  }
  const returnMappedList = list?.map(e => ({...e, checked: e.propertyPostId === id}));
  const returnSingleItemList = list?.filter(e => e.propertyPostId === id);
  if (returnSingleItemList.length > 0) {
    returnSingleItemList[0].checked = true;
  }
  return needOnlyOne ? returnSingleItemList : returnMappedList;
};

export const validatePaymentAmount = (progresses, maxValue) => {
  if (!progresses || progresses.length === 0) {
    return progresses;
  }

  let totalRemaining = maxValue;
  return progresses?.map(e => {
    const depositAmount = NumberUtils.parseIntValue(e.amount);
    const remainingAmount = totalRemaining - depositAmount;

    totalRemaining -= depositAmount;

    return {
      ...e,
      remainingPayAmount: remainingAmount,
    };
  });
};

export const validatePaymentDatetime = (progresses, defaultMinDate, defaultMaxDate) => {
  let lastMinDate = defaultMinDate;
  const updatedProgresses = progresses?.map((e, index) => {
    const lastMinDateTmp = lastMinDate;
    const invalidDatetime = lastMinDateTmp - e.paymentDatetime > 0;
    const validPaymentDatetime = invalidDatetime ? lastMinDateTmp : e.paymentDatetime;

    lastMinDate = validPaymentDatetime + DAY_TO_MILISECOND;

    return {
      ...e,
      maxDate: index === 0 ? defaultMaxDate : null,
      minDate: lastMinDateTmp ? new Date(lastMinDateTmp) : null,
      paymentDatetime: validPaymentDatetime,
    };
  });

  return updatedProgresses;
};
