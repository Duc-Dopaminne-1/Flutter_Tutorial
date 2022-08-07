import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import {
  CommissionCurrencyUnit,
  CONSTANTS,
  MIN_LENGTH,
  PROPERTY_LOCATION,
} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {STRINGS} from '../../assets/localize/string';
import NumberUtils from '../../utils/NumberUtils';
import ValidateInput from '../../utils/ValidateInput';
import ValidateInputMessage from '../../utils/ValidateInputMessage';
import PropertyType from './PropertyType';

const MINIMUM_COMMISSION = 1;

const getListRequiredDetailKey = (type = PropertyType.apartment, propertyLocation) => {
  if (isEmpty(type)) {
    return [];
  }

  const defaultKeys = [STRINGS.LAND_ACREAGE, STRINGS.DIRECTION];

  switch (type) {
    case PropertyType.apartment:
      return defaultKeys;
    case PropertyType.house:
    case PropertyType.villa:
    case PropertyType.land:
      const isAlley = propertyLocation === PROPERTY_LOCATION.ALLEY;

      defaultKeys.push('propertyLocation');

      if (isAlley) {
        defaultKeys.push('alleyWidth');
      }
      return defaultKeys;
    default:
      return [];
  }
};

const validateDetailInput = ({state, propertyType}) => {
  const allComponents = Object.keys(state);
  const errorMsg = {};
  const requiredDetailFields = getListRequiredDetailKey(propertyType, state?.propertyLocation);
  allComponents.forEach(key => {
    if (requiredDetailFields.includes(key)) {
      let errorId;
      if (key === 'propertyLocation') {
        errorId =
          state.propertyLocation === 'UNDEFINED'
            ? ValidateInput.checkRequiredField('')
            : ValidateInput.checkRequiredField(state[key]);
      } else {
        errorId = ValidateInput.checkRequiredField(state[key]);
      }

      if (errorId) {
        errorMsg[key] = translate(Message?.[errorId]);
      }
    }
  });

  return errorMsg;
};

const validateAddress = state => {
  const stateAddress = state.propertyAddress ?? {};
  return {
    city: stateAddress.cityId ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    district: stateAddress.districtId ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    ward: stateAddress.wardId ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    streetName: ValidateInputMessage.checkRequiredFieldMessage(stateAddress.streetName),
  };
};

const clearAddressError = () => {
  return {city: '', district: '', ward: '', homeAddress: '', streetName: ''};
};

const validateCommission = (fieldName, state) => {
  switch (fieldName) {
    case 'commission':
      const parsePrice = NumberUtils.parseIntValue(state?.price);
      const parseCommissionValue = NumberUtils.parseFloatValue(state?.commission?.value);
      const minValue = 20 * CONSTANTS.MILLION;
      const compareValue =
        state?.commission?.id === CommissionCurrencyUnit.VND
          ? parseCommissionValue
          : (parsePrice * parseCommissionValue) / 100;

      return {
        commission: ValidateInputMessage.checkRequiredMinPrice(
          compareValue,
          minValue,
          parseCommissionValue,
          MINIMUM_COMMISSION,
        ),
      };
    case 'rentCommission':
      if (
        !isEmpty(state?.rentCommission?.id) &&
        state?.rentCommission?.id === CommissionCurrencyUnit.VND
      ) {
        return {
          rentCommission: ValidateInputMessage.checkRequiredMinPrice(state?.rentCommission?.value),
        };
      }
      return {
        rentCommission: ValidateInputMessage.checkRequiredFieldMessage(
          state?.rentCommission?.value,
        ),
      };
  }

  return {[fieldName]: ''};
};

const validatePrice = (fieldName, state) => {
  switch (fieldName) {
    case 'price':
      return {
        price: ValidateInputMessage.checkRequiredMinPriceCustomMessage(state.price),
      };
    case 'rentPrice':
      return {
        rentPrice: ValidateInputMessage.checkRequiredMinPriceCustomMessage(state.rentPrice),
      };
  }

  return {[fieldName]: ''};
};

function clearCommissionError(fieldName) {
  return {[fieldName]: ''};
}

function clearPriceError(fieldName) {
  return {[fieldName]: ''};
}

const validateImages = images => {
  if (!images || images?.length === 0) {
    return ValidateInputMessage.checkRequiredFieldMessage('');
  }

  if (images?.length < 3) {
    return Message.CPP_ERR_001;
  }

  return '';
};

const validateOwner = state => {
  let errName = '';
  let errPhoneNumber = '';
  let errEmail = '';
  if (!state.ownerIsAuthor) {
    errName = ValidateInput.checkName(state.ownerName);
    errPhoneNumber = ValidateInput.checkMobilePhone(state.ownerPhoneNumber);
    errEmail = ValidateInput.checkEmail(state.ownerEmail);
  }

  return {
    ownerName: errName ? translate(errName) : '',
    ownerPhoneNumber: errPhoneNumber ? translate(errPhoneNumber) : '',
    ownerEmail: errEmail ? translate(errEmail) : '',
  };
};

const clearOwnerError = () => {
  return {ownerName: '', ownerPhoneNumber: '', ownerEmail: ''};
};

function validateFieldName(fieldName, state) {
  switch (fieldName) {
    case 'postTitle':
      return {
        postTitle: ValidateInputMessage.checkRequiredFieldMessageWithMinLength(
          state.postTitle,
          MIN_LENGTH.TITLE_INPUT,
        ),
      };
    case 'postDescription':
      return {
        postDescription: ValidateInputMessage.checkRequiredFieldMessageWithMinLength(
          state.postDescriptionPlainText,
          MIN_LENGTH.TITLE_INPUT,
        ),
      };
    case 'propertyType':
      return {propertyType: ValidateInputMessage.checkRequiredFieldMessage(state.propertyTypeId)};
    case 'lastFullAddress':
      return {
        lastFullAddress: ValidateInputMessage.checkRequiredFieldMessage(state.lastFullAddress),
      };
    case 'images':
      return {
        images: validateImages(state?.images),
      };
  }

  return {[fieldName]: ''};
}

function validateExpiredDate(state) {
  const errorRequireFill = translate(STRINGS.REQUIRED_FIELD);
  const errorExpiredDateInThePast = translate(STRINGS.CAN_NOT_POST_WITH_EXPIRED_DATE_IN_THE_PAST);
  let error = '';
  if (state.expiredDate) {
    error = moment(state.expiredDate).isBefore(moment()) ? errorExpiredDateInThePast : '';
  } else {
    error = errorRequireFill;
  }
  return {
    expiredDate: error,
  };
}

function clearFieldError(fieldName) {
  return {[fieldName]: ''};
}

function clearProjectError() {
  return {freeTextProject: ''};
}

function validateProject(state) {
  return {freeTextProject: ValidateInputMessage.checkRequiredFieldMessage(state.freeTextProject)};
}

const checkLongLat = (value, min, max) => {
  const strNumber = String(value);
  let error = '';
  if (
    !strNumber ||
    !strNumber.trim() ||
    isNaN(strNumber) ||
    parseFloat(strNumber) < min ||
    parseFloat(strNumber) > max
  ) {
    error = translate(Message.INVALID_COORDINATE);
  }
  return error;
};

const validateCoordinate = coordinate => {
  const errorLat = checkLongLat(
    coordinate?.latitude,
    CONSTANTS.POST_POSITION_MIN_LATITUDE,
    CONSTANTS.POST_POSITION_MAX_LATITUDE,
  );

  const errorLong = checkLongLat(
    coordinate?.longitude,
    CONSTANTS.POST_POSITION_MIN_LONGITUDE,
    CONSTANTS.POST_POSITION_MAX_LONGITUDE,
  );

  return {
    errorLat: errorLat,
    errorLong: errorLong,
    isValid: errorLat + errorLong === '',
  };
};

/**
 * Check validate input toạ độ latitude và longitude
 * @param {*} coordinateText input toạ độ
 * @returns object: isInputEmpty input value = "", coordinateText: error text
 */
const validateCoordinateText = coordinateText => {
  if (isEmpty(coordinateText)) return {isInputEmpty: true, coordinateText: ''};
  const re =
    /^(\-?([0-8]?[0-9](\.\d+)?|90(.[0]+)?)\s?[,]\s?)+(\-?([1]?[0-7]?[0-9](\.\d+)?|180((.[0]+)?)))$/g;

  const resultValidate = re.test(coordinateText);
  return {
    isInputEmpty: false,
    coordinateText: resultValidate ? '' : translate(Message.INVALID_COORDINATE),
  };
};

const validatePropertyInput = state => {
  let errorRentalState = {};
  if (state.forRent) {
    errorRentalState = {
      ...validateCommission('rentCommission', state),
      ...validatePrice('rentPrice', state),
    };
  }

  let errorSellingState = {};
  if (state.forSale) {
    errorSellingState = {
      ...validatePrice('price', state),
    };
  }
  const validateLocationText = validateCoordinateText(state?.coordinateText);

  const errorState = {
    ...validateAddress(state),
    ...validateFieldName('propertyType', state),
    ...errorSellingState,
    ...errorRentalState,
    coordinateText: validateLocationText?.coordinateText,
  };

  const detailErrors = validateDetailInput({
    state: state?.detailInfo,
    propertyType: state?.propertyTypeName,
  });
  const isDetailValid = !Object.values(detailErrors).some(item => item !== '');
  const isValid = !Object.values(errorState).some(item => item !== '');
  return {
    ...errorState,
    isValid: isValid && isDetailValid,
    detailErrors: detailErrors,
    isValidCoordinate: !validateLocationText.isInputEmpty, // coordinate text có gía trị hoặc không
  };
};

const validatePropertyStep2 = state => {
  const errorState = {
    ...validateFieldName('postTitle', state),
    ...validateFieldName('postDescription', state),
    ...validateFieldName('images', state),
  };
  const isValid = !Object.values(errorState).some(item => item !== '');
  return {
    ...errorState,
    isValid: isValid,
  };
};

const validateStreetViewUrl = value => {
  if (String(value).toLowerCase().includes('<iframe') && !isEmpty(value)) {
    return '';
  } else {
    return translate(Message.INVALID_DATA);
  }
};

const ValidatePropertyInput = {
  validatePropertyInput,
  validateFieldName,
  validateExpiredDate,
  clearFieldError,
  clearProjectError,
  validateProject,
  validateCommission,
  validateAddress,
  clearAddressError,
  validatePrice,
  clearCommissionError,
  clearPriceError,
  validateOwner,
  clearOwnerError,
  validateDetailInput,
  validateCoordinate,
  validateStreetViewUrl,
  validateCoordinateText,
  validatePropertyStep2,
};

export default ValidatePropertyInput;
