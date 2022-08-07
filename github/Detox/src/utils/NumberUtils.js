import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import isNumber from 'lodash/isNumber';

import {CONSTANTS} from '../assets/constants';

const NUMBER_TO_WORD = {
  unit: {
    0: 'không',
    1: 'một',
    '01': 'mốt',
    2: 'hai',
    3: 'ba',
    4: 'bốn',
    5: 'năm',
    6: 'sáu',
    7: 'bảy',
    8: 'tám',
    9: 'chín',
    10: 'mười',
  },
  suffix: {
    dozen: 'mươi',
    hundred: 'trăm',
    thousand: 'ngàn',
    million: 'triệu',
    billion: 'tỷ',
  },
};

const RADIX = 10;
const MIN_NUMBER = 0;
const BILLION_VALUE = 1000000000;
const MAX_NUMBER = 1000 * BILLION_VALUE; // Max number that db can support: 1000 billion
const MAX_NUMBER_DIGITS = 15;
const MAX_FLOATING_POINT_DIGITS = 2;

const parseIntValue = value => {
  return value ? parseInt(value, RADIX) : 0;
};

const parseFloatValue = value => {
  return value ? parseFloat(value) : 0;
};

const numberToString = (number, defaultValue = '') => {
  if (number) {
    const value = parseFloatValue(number);
    return value > 0 ? number.toString() : defaultValue;
  }
  return defaultValue;
};

const onChangeTextWithValidation = (text, onChangeText, validateFunction) => {
  if (!onChangeText || typeof onChangeText !== 'function') {
    return; //do nothing
  }

  const isValid = validateFunction(text);
  if (isValid) {
    onChangeText(text);
  }
};

const isValidFloatNumber = (
  text,
  maxRoundDigits = MAX_NUMBER_DIGITS,
  floatingPointDigits = MAX_FLOATING_POINT_DIGITS,
) => {
  const re = RegExp(`^([0-9]{0,${maxRoundDigits}}(\\.[0-9]{0,${floatingPointDigits}})?)$`);
  const isValid = re.test(text) === true;
  return isValid;
};

const isValidFloatNumberInRange = (
  text,
  min = MIN_NUMBER,
  max = MAX_NUMBER,
  maxFractionDigit = MAX_FLOATING_POINT_DIGITS,
) => {
  const validNumber = isValidFloatNumber(text, MAX_NUMBER_DIGITS, maxFractionDigit);
  if (!validNumber) {
    return false;
  }
  const maxValue = Math.min(max, MAX_NUMBER);
  const number = isEmpty(text) ? 0 : parseFloatValue(text);
  const isValid = number <= maxValue && number >= min;
  return isValid;
};

const isValidIntNumber = (text, maxRoundDigits = MAX_NUMBER_DIGITS) => {
  const re = RegExp(`^([0-9]{0,${maxRoundDigits}})?$`);
  const isValid = re.test(text) === true;
  return isValid;
};

const isValidIntNumberInRange = (text, min = MIN_NUMBER, max = MAX_NUMBER) => {
  const validNumber = isValidIntNumber(text);
  if (!validNumber) {
    return false;
  }
  const maxValue = Math.min(max, MAX_NUMBER);
  const number = isEmpty(text) ? 0 : parseIntValue(text);
  const isValid = number <= maxValue && number >= min;
  return isValid;
};

const onChangeIntNumber = (text, onChangeText) => {
  onChangeTextWithValidation(text, onChangeText, isValidIntNumberInRange);
};

const onChangeFloatNumber = (text, onChangeText) => {
  onChangeTextWithValidation(text, onChangeText, isValidFloatNumberInRange);
};

/**
 * formatNumber(n, x)
 * @param number number: needed to be formated
 * @param integer n: length of decimal
 * @param integer x: length of sections
 */
const formatNumber = (number, n, x) => {
  const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  // eslint-disable-next-line no-bitwise
  return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
};

function handleNaturalNum(number, separator) {
  let parts = number.toString();
  parts = parts.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts;
}

function handleDecimalNum(decimalNum, extend, simplify = false) {
  const zero = '0';
  if (decimalNum.length > extend) {
    decimalNum = decimalNum.substr(0, extend);
  } else if (
    (decimalNum.length > 0 && decimalNum.length < extend && !simplify) ||
    decimalNum === ''
  ) {
    const missingZero = zero.repeat(extend - decimalNum.length);
    decimalNum = decimalNum.concat('', missingZero);
  }
  return decimalNum;
}
/**
 * Format number to custom currency
 * @param {*} num number input
 * @param {*} extend extend decimal number
 * @param {*} separator separator character
 * @param {*} simplify (true/false) remove all 0 end of decimal number
 * @returns String of formatted number, Format the input(1000000.556...) into (1,000,000.56)
 */
export function formatNumberToCurrencyNumber(num, extend = 3, separator = ',', simplify = false) {
  const re = /^\-?\d+\.?\d*$/;
  if (!re.test(num)) {
    return num;
  } else {
    const number = num.toString();
    const numbers = number.split('.');
    let naturalNum = numbers[0] || number;
    let decimalNum = numbers[1] || '';
    if (decimalNum && extend !== 0) {
      decimalNum = handleDecimalNum(decimalNum, extend, simplify);
    }
    if (naturalNum.length > 3) {
      naturalNum = handleNaturalNum(naturalNum, separator);
    }
    let output = naturalNum;
    if (extend !== 0 && parseIntValue(decimalNum) > 0) {
      output = naturalNum.concat('.', decimalNum);
    }
    return output;
  }
}

export function removeAllComma(str) {
  if (typeof str !== typeof '') {
    return str;
  } else {
    const result = str.replace(/,/g, '');
    return result;
  }
}

const convertNumberToThousand = number => {
  if (!isNull(number)) {
    if (number >= CONSTANTS.THOUSAND && number <= 9999) {
      return Math.trunc((number / CONSTANTS.THOUSAND) * 100) / 100 + 'K';
    } else if (number > 9999 && number <= 99999) {
      return Math.trunc((number / 10000) * 100) / 10 + 'K';
    } else if (number > 99999 && number <= 999999) {
      return Math.trunc((number / 100000) * 100) + 'K';
    } else if (number >= CONSTANTS.MILLION) {
      return Math.trunc((number / CONSTANTS.MILLION) * 100) / 100 + 'M';
    }
    return number;
  }
  return '';
};

const capitalizeFirstLetter = string => {
  const trimmedString = string.trimStart();
  return trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1);
};

const mapNumberToWordSuffix = numberPosition => {
  switch (true) {
    case numberPosition > 9:
      return NUMBER_TO_WORD.suffix.billion;
    case numberPosition > 6:
      return NUMBER_TO_WORD.suffix.million;
    case numberPosition > 3:
      return NUMBER_TO_WORD.suffix.thousand;
    default:
      return '';
  }
};

const map3NumberToWord = (
  thousand = null,
  hundred = null,
  dozen = null,
  unit = null,
  numberSuffix = null,
) => {
  const hasNumber = dozen > 0 || unit > 0 || hundred > 0;

  if (!hasNumber && thousand) {
    return '';
  }

  const mapHundred =
    hasNumber && `${NUMBER_TO_WORD.unit[hundred]} ${NUMBER_TO_WORD.suffix.hundred}`;
  const mapUnit =
    dozen > 1 && unit === '1'
      ? `${NUMBER_TO_WORD.unit['01']}`
      : `${dozen === '0' ? 'lẻ ' : ''}${NUMBER_TO_WORD.unit[unit]}`;
  const mapDozen =
    dozen === '1'
      ? `${NUMBER_TO_WORD.unit[10]}`
      : `${NUMBER_TO_WORD.unit[dozen]} ${NUMBER_TO_WORD.suffix.dozen}`;

  const hundredToWord = thousand || hundred > 0 ? mapHundred : '';
  const dozenToWord = dozen > 0 ? mapDozen : '';
  const unitToWord = unit > 0 ? mapUnit : '';

  const threeDigitsToWord = `${hundredToWord && hundredToWord + ' '}${
    dozenToWord && dozenToWord + ' '
  }${unitToWord && unitToWord + (numberSuffix && ' ')}${numberSuffix}`;

  return threeDigitsToWord;
};

const mapNumberToWord = number => {
  const re = /^\d+\.?\d*$/;
  if (number && re.test(number)) {
    const tempNumber = isNumber(number) ? number.toString() : number;
    const numberParts = tempNumber.split('.');
    const naturalNumber = numberParts[0] || tempNumber;
    const words = [];
    let position = 0;
    for (let i = naturalNumber.length - 1; i > -1; i--) {
      position++;
      const numberSuffix = mapNumberToWordSuffix((position + (position > 12 ? 4 : 0)) % 13);

      if (position % 3 === 0) {
        const thousand = naturalNumber[i - 1] ?? null;
        const hundred = naturalNumber[i] ?? null;
        const dozen = naturalNumber[i + 1] ?? null;
        const unit = naturalNumber[i + 2] ?? null;

        const mapped3Digits = map3NumberToWord(thousand, hundred, dozen, unit, numberSuffix);
        if (mapped3Digits) {
          words.unshift(mapped3Digits);
        } else if (position % 12 === 0) {
          words.unshift(numberSuffix);
        }
      } else if (i < 2 && (position + i) % 3 !== 0) {
        const dozen = naturalNumber[i - 1] ?? null;
        const unit = naturalNumber[i] ?? null;

        const firstSetOfDigits = map3NumberToWord(null, null, dozen, unit, numberSuffix);
        words.unshift(firstSetOfDigits);
        break;
      }
    }

    const output = capitalizeFirstLetter(words.join(' '))?.trimEnd();
    return output;
  }

  return number;
};

export const formatMaxNumber = (number, maxNumber = 99) => {
  return number > maxNumber ? `${maxNumber}+` : number;
};

const NumberUtils = {
  parseFloatValue,
  convertNumberToThousand,
  parseIntValue,
  numberToString,
  onChangeTextWithValidation,
  onChangeIntNumber,
  onChangeFloatNumber,
  isValidFloatNumberInRange,
  isValidIntNumberInRange,
  isValidIntNumber,
  isValidFloatNumber,
  formatNumber,
  formatNumberToCurrencyNumber,
  removeAllComma,
  mapNumberToWord,
};

export default NumberUtils;
