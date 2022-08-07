import isEmpty from 'lodash/isEmpty';
import {Platform} from 'react-native';
import rnTextSize from 'react-native-text-size';

import {
  APP_CURRENCY,
  CONSTANTS,
  METRIC_UNIT,
  ONE_LINE_TEXT,
  UNIT_OF_MEASURE_ID,
} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {NOT_ALLOW_FONT_SCALE} from './avoidFontScale';
import NumberUtils from './NumberUtils';

const ONE_BILLION = 1000000000.0;
const ONE_MILLION = 1000000.0;
const ONE_HUNDRED_MILLION = 100000000.0; // 100M
const MIN_CURRENCY = 1000;
export const MAX_SUGGESTION_LENGTH = 5;

const priceFloorDown = price => {
  return Math.floor(price * 10) / 10;
};

const priceFromBillionUnit = price => {
  return price * CONSTANTS.BILLION;
};

const priceToBillionUnit = price => {
  return price / CONSTANTS.BILLION;
};

const priceToMillionUnit = price => {
  return (price ?? 0) / ONE_MILLION;
};

const getSquareMeterText = value => {
  return `${value ?? 0} ${METRIC_UNIT.SQUARE_METER}`;
};

const getMeterText = value => {
  return `${value ?? 0} ${METRIC_UNIT.METER}`;
};

const getPriceFromPriceDescription = priceDescription => {
  if (!priceDescription || priceDescription?.length === 0) {
    return null;
  }
  const price = parseFloat(priceDescription);
  let output = price;
  if (priceDescription.includes(translate(STRINGS.MILLION))) {
    output *= 1000000;
  }
  if (priceDescription.includes(translate(STRINGS.BILLION))) {
    output *= 1000000000;
  }
  return output;
};

const getPriceDescriptionNoUnitInput = (rawPrice, decimalAmount = 3, visibleCurrency = true) => {
  if (!rawPrice) {
    return '';
  }
  const price = rawPrice / ONE_BILLION;
  if (price >= 1) {
    const billion = NumberUtils.formatNumberToCurrencyNumber(price, 3, ',', true);
    return `${billion} ${translate(STRINGS.BILLION)}`;
  } else {
    if (rawPrice < ONE_MILLION) {
      return `${NumberUtils.formatNumberToCurrencyNumber(rawPrice, 0)}${
        visibleCurrency ? ` ${APP_CURRENCY}` : ''
      }`;
    }
    const million = NumberUtils.formatNumberToCurrencyNumber(
      rawPrice / ONE_MILLION,
      decimalAmount,
      ',',
      true,
    );
    return `${million} ${translate(STRINGS.MILLION)}`;
  }
};

const getPriceUnitMillionSquareMeter = price => {
  return `${priceToMillionUnit(price)} ${translate(STRINGS.UNIT_MILLION_M2)}`;
};

const getPriceFullFormat = (price, currencyUnit = APP_CURRENCY) => {
  return `${NumberUtils.formatNumber(parseFloat(price) || 0)} ${currencyUnit}`;
};

const getTextHeight = ({height, lineCount}, maxLine) => {
  if (lineCount > 1) {
    return (height / lineCount) * maxLine;
  }
  return height;
};

const safeMeasureTextSize = async param => {
  let textSize;
  try {
    textSize = await rnTextSize.measure(param);
  } catch (error) {
    textSize = await rnTextSize.measure({
      ...param,
      text: ONE_LINE_TEXT,
    });
  }

  return textSize;
};

const measureTextSize = async param => {
  // check input param
  if (!param) {
    return {height: 0, lineCount: 0};
  }

  // opt out lineInfoForLine to avoid bug on Android when mix multi-language
  const {lineInfoForLine, ...otherParams} = param;
  const maxLine = lineInfoForLine;
  const textSize = await safeMeasureTextSize({
    ...otherParams,
    ...NOT_ALLOW_FONT_SCALE,
    //textBreakStrategy: 'simple',
    includeFontPadding: true,
  });

  if (textSize.lineCount > 1 && maxLine) {
    const oneLineSize = await safeMeasureTextSize({
      ...otherParams,
      text: ONE_LINE_TEXT,
      includeFontPadding: true,
      ...NOT_ALLOW_FONT_SCALE,
    });

    const lineCount = maxLine;
    const paragraphHeight = Math.ceil(oneLineSize.height) * lineCount;
    if (Platform.OS === 'android') {
      const oneLineWithPadding = await safeMeasureTextSize({
        ...otherParams,
        text: ONE_LINE_TEXT,
        ...NOT_ALLOW_FONT_SCALE,
        includeFontPadding: true,
      });

      const padding = oneLineWithPadding.height - oneLineSize.height;
      return {height: paragraphHeight + padding, lineCount};
    } else {
      return {height: paragraphHeight, lineCount};
    }
  }

  return textSize;
};

/**
 * get bonus number exponent to format price
 * @param {*} value The price divine base number 10
 * @returns
 */
const getDefaultPrice = value => {
  const basePrice = NumberUtils.parseIntValue(value);
  const exponent = basePrice.toString().length - 1;
  const floatPrice = basePrice / Math.pow(10, exponent);
  const values = String(floatPrice).split('.');
  const value2 = values[1];

  if (!isEmpty(value2) && NumberUtils.parseIntValue(value2) > ONE_MILLION) {
    const exp = 3 + value2.length;
    const price = Math.round(floatPrice * Math.pow(10, exp));
    return price > basePrice ? price : basePrice;
  }

  // kiểm tra số tiền lẻ nhỏ nhất lớn hơn 1000
  const priceTemp = Math.round(floatPrice * ONE_MILLION);
  const prices = String(priceTemp / MIN_CURRENCY).split('.');
  const numberThousand = prices[1];
  if (!isEmpty(numberThousand)) {
    const exp = numberThousand.length;
    const price = Math.round(floatPrice * ONE_MILLION * Math.pow(10, exp));
    return price > basePrice ? price : basePrice;
  }

  if (basePrice >= ONE_MILLION) {
    return basePrice;
  }
  return floatPrice * ONE_MILLION;
};

const generateSuggestionPrices = value => {
  const baseInput = NumberUtils.parseIntValue(value);
  if (NumberUtils.isValidIntNumber(value) && baseInput > 0) {
    const prices = [];
    const defaultPrice = getDefaultPrice(baseInput);
    let priceVal = ONE_MILLION;
    for (let i = 0; i < MAX_SUGGESTION_LENGTH; i++) {
      priceVal = defaultPrice * Math.pow(10, i);
      if (priceVal <= CONSTANTS.MAX_PRICE_VALUE) {
        const name = NumberUtils.formatNumberToCurrencyNumber(priceVal, 0);
        prices.push({name: String(name), value: priceVal});
      } else {
        break;
      }
    }
    return prices;
  }
  return [];
};

const getPriceSuggestionOptions = value => {
  const parseIntValue = NumberUtils.parseIntValue(value);
  if (NumberUtils.isValidIntNumber(value) && parseIntValue > 0) {
    const priceLength = Number(parseIntValue).toString().length;
    const millionLength = ONE_HUNDRED_MILLION.toString().length;
    const multiplier =
      millionLength - priceLength > 0 ? Math.pow(10, millionLength - priceLength) : 1;
    const options = [
      {
        value: parseIntValue * multiplier * 10,
        name: NumberUtils.formatNumberToCurrencyNumber(parseIntValue * multiplier * 10, 0),
      },
      {
        value: parseIntValue * multiplier * 100,
        name: NumberUtils.formatNumberToCurrencyNumber(parseIntValue * multiplier * 100, 0),
      },
    ];

    // User input < 100M
    if (parseIntValue < ONE_HUNDRED_MILLION) {
      return [
        {
          value: parseIntValue * multiplier,
          name: NumberUtils.formatNumberToCurrencyNumber(parseIntValue * multiplier, 0),
        },
        ...options,
      ];
    }

    // 100M <= User input < 1B
    if (parseIntValue >= ONE_HUNDRED_MILLION && parseIntValue < ONE_BILLION) {
      return options;
    }
  }
  return [];
};

const getUnitOFMeasureIdByPrice = rawPrice => {
  if (!rawPrice) {
    return '';
  }
  const price = NumberUtils.parseIntValue(rawPrice) / ONE_BILLION;
  if (price >= 1) {
    return UNIT_OF_MEASURE_ID.BILLION;
  } else {
    return UNIT_OF_MEASURE_ID.MILLION;
  }
};

const isValidPriceValue = price => {
  const value = NumberUtils.parseIntValue(price);
  if (
    NumberUtils.isValidIntNumber(value) &&
    value <= CONSTANTS.MAX_PRICE_VALUE &&
    value.toString().length <= 14
  ) {
    return true;
  }
  return false;
};

const getPricePerSquare = (price, area, decimal = 0) => {
  if (!price || !area) {
    return 0;
  }

  const pricePerSquare = priceToMillionUnit(price / area);

  const isRoundNumber = pricePerSquare.toFixed(decimal) % 1 === 0;

  return isRoundNumber ? pricePerSquare.toFixed(0) : pricePerSquare.toFixed(decimal);
};

const MeasureUtils = {
  priceFromBillionUnit,
  priceToBillionUnit,
  getSquareMeterText,
  getMeterText,
  getPriceDescriptionNoUnitInput,
  getPriceUnitMillionSquareMeter,
  priceToMillionUnit,
  getPriceFullFormat,
  getTextHeight,
  measureTextSize,
  priceFloorDown,
  getPriceFromPriceDescription,
  generateSuggestionPrices,
  getUnitOFMeasureIdByPrice,
  isValidPriceValue,
  getPriceSuggestionOptions,
  getPricePerSquare,
};

export default MeasureUtils;
