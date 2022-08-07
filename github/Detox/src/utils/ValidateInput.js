import isEmptyLodash from 'lodash/isEmpty';
import moment from 'moment';

import {FLOAT_NUMBER_REGEX, INTEGER_NUMBER_REGEX, NUMBER_AND_TEXT_REGEX} from '../assets/constants';
import {Message} from '../assets/localize/message/Message';

const OTP_LENGTH = 6;
const USERNAME_ATLEAST = 6;
const PASSWORD_ATLEAST = 8;

const isEmpty = text => {
  if (!text) {
    return true;
  }

  if (typeof text === 'string') {
    if (text.trim()) {
      return false;
    }
    return true;
  } else {
    // Change to string to check, when text is number, then result is incorrect
    return isEmptyLodash(String(text).trim());
  }
};

const checkName = text => {
  return checkRequiredField(text);
};

const checkUserName = text => {
  if (isEmpty(text)) {
    return Message.MRG_ERR_001;
  }
  //Check contain only letters or digits
  //let re = /^[A-Za-z0-9]{6,}$/;
  const re = RegExp(`^[A-Za-z0-9]{${USERNAME_ATLEAST},}$`);
  if (re.test(text) === false) {
    return Message.MRG_ERR_011;
  }
  return '';
};

function checkMobilePhoneVN(text) {
  if (isEmpty(text)) {
    return Message.MRG_ERR_001;
  }
  return checkValidPhoneNumberFormatVN(text);
}

function normalizePhoneNumberVN(phoneNumber) {
  return phoneNumber;
}

function checkValidPhoneNumberFormatVN(text) {
  const re = /^[0][0-9]{9,9}$/;
  if (re.test(text) === false) {
    return Message.MRG_ERR_003;
  }
  return '';
}

const checkEmail = (text, isRequired = true) => {
  if (!isRequired && isEmpty(text)) {
    return '';
  }
  if (isEmpty(text)) {
    return Message.MRG_ERR_001;
  }
  //Check regrex email
  const re = /^[a-zA-Z0-9][\w\-.+_%!#$%&'*+-/=?^_`{|}~]*@[\w\.\-]+\.[A-Za-z0-9]{2,}$/i;
  if (re.test(text) === false) {
    return Message.MRG_ERR_004;
  }
  return '';
};

const checkPassword = text => {
  if (isEmpty(text)) {
    return Message.MRG_ERR_001;
  }
  const re = RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])[\\W\\w]{${PASSWORD_ATLEAST},}$`);
  if (re.test(text) === false) {
    return Message.MRG_ERR_006;
  }
  return '';
};

const checkConfirmPassword = (password, confirmPassword) => {
  if (isEmpty(confirmPassword)) {
    return Message.MRG_ERR_001;
  }
  return password === confirmPassword ? '' : Message.MRG_ERR_007;
};

const checkOtp = text => {
  if (isEmpty(text)) {
    return Message.MRG_ERR_001;
  }
  const re = RegExp(`^[0-9]{${OTP_LENGTH},${OTP_LENGTH}}$`);
  if (re.test(text) === false) {
    return Message.MRG_ERR_005;
  }
  return '';
};

function checkRequiredField(text) {
  if (isEmpty(text)) {
    return Message.MRG_ERR_001;
  }

  return '';
}

function validateGender(text) {
  if (isEmpty(text) || text === 'NA' || text === 'N/A') {
    return Message.MRG_ERR_001;
  }

  return '';
}

const checkBirthday = isoString => {
  if (isEmpty(isoString)) {
    return Message.MRG_ERR_001;
  }
  const years = moment().diff(new Date(isoString), 'years', false);
  if (years < 18) {
    return Message.MRG_ERR_018;
  }
  return '';
};

function checkIdentity(text) {
  if (isEmpty(text)) {
    return Message.MMP_ERR_001;
  } else if (checkFloatNumberOnly(text)) {
    return checkFloatNumberOnly(text);
  } else if (text.length <= 8 || text.length >= 13) {
    return Message.MRG_ERR_014;
  }
  return '';
}

function checkFloatNumber(text, allowFalsyValue = true) {
  if (isEmpty(text)) {
    return Message.MMP_ERR_001;
    // eslint-disable-next-line eqeqeq
  } else if (!FLOAT_NUMBER_REGEX.test(text) || (!allowFalsyValue && text == 0)) {
    return Message.INVALID_NUMBER;
  }

  return '';
}

function checkFloatNumberOnly(text, allowFalsyValue = true) {
  // eslint-disable-next-line eqeqeq
  if (!FLOAT_NUMBER_REGEX.test(text) || (!allowFalsyValue && text == 0)) {
    return Message.INVALID_NUMBER;
  }
  return '';
}

function checkIntNumber(text, allowFalsyValue = true) {
  if (isEmpty(text)) {
    return Message.MMP_ERR_001;
    // eslint-disable-next-line eqeqeq
  } else if (!INTEGER_NUMBER_REGEX.test(text) || (!allowFalsyValue && text == 0)) {
    return Message.INVALID_NUMBER;
  }
  return '';
}

function checkIntNumberOnly(text) {
  if (!INTEGER_NUMBER_REGEX.test(text)) {
    return Message.INVALID_NUMBER;
  }
  return '';
}

function validateRequiredField(field, value) {
  return {[field]: checkRequiredField(value)};
}

function validateRequiredFloatNumberField(field, value, allowFalsyValue = true) {
  return {[field]: checkFloatNumber(value, allowFalsyValue)};
}

function validateRequiredIntNumberField(field, value, allowFalsyValue = true) {
  return {[field]: checkIntNumber(value, allowFalsyValue)};
}

function validateFloatNumber(field, value) {
  if (value) {
    return {[field]: checkFloatNumberOnly(value)};
  }
  return {[field]: ''};
}

function validateIntNumber(field, value) {
  if (value) {
    return {[field]: checkIntNumberOnly(value)};
  }
  return {[field]: ''};
}

function validateRequiredEmail(field, value, isRequired = true) {
  return {[field]: checkEmail(value, isRequired)};
}

function validateRequiredPhoneNumber(field, value) {
  return {[field]: checkMobilePhoneVN(value)};
}

function validateRequiredSSN(field, value) {
  return {[field]: checkIdentity(value)};
}

function validateAccountNumber(text) {
  if (isEmpty(text)) {
    return Message.MRG_ERR_001;
  } else if (!NUMBER_AND_TEXT_REGEX.test(text) || text.length < 7) {
    return Message.INVALID_ACCOUNT_NUMBER;
  }
  return '';
}

const ValidateInput = {
  isEmpty,
  checkName,
  checkIdentity,
  checkUserName,
  checkMobilePhone: checkMobilePhoneVN,
  checkEmail,
  checkPassword,
  checkConfirmPassword,
  checkOtp,
  checkBirthday,
  normalizePhoneNumber: normalizePhoneNumberVN,
  checkRequiredField,
  checkFloatNumber,
  checkIntNumber,
  checkFloatNumberOnly,
  checkIntNumberOnly,
  validateRequiredField,
  validateRequiredFloatNumberField,
  validateRequiredIntNumberField,
  validateFloatNumber,
  validateIntNumber,
  validateRequiredEmail,
  validateRequiredPhoneNumber,
  validateRequiredSSN,
  validateGender,
  validateAccountNumber,
};

export default ValidateInput;
