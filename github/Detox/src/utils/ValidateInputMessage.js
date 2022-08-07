import {CONSTANTS} from '../assets/constants';
import {translate} from '../assets/localize';
import {Message} from '../assets/localize/message/Message';
import NumberUtils from './NumberUtils';
import ValidateInput from './ValidateInput';

function checkRequiredFieldMessage(text) {
  if (ValidateInput.isEmpty(text)) {
    return translate(Message.MRG_ERR_001);
  }

  return '';
}

function checkRequiredFieldMessageWithMinLength(text, minLength = 1) {
  if (ValidateInput.isEmpty(text) || String(text).length < minLength) {
    return translate(Message.MRG_ERR_015, {minLength: minLength});
  }

  return '';
}

function checkRequiredMinPrice(price, minPrice = CONSTANTS.MILLION, commission, minCommission) {
  const parsePrice = NumberUtils.parseIntValue(price);
  if (ValidateInput.isEmpty(commission)) {
    return translate(Message.MRG_ERR_001);
  } else if (parsePrice < minPrice || commission < minCommission) {
    return translate(Message.MRG_ERR_016);
  }

  return '';
}

function checkRequiredMinPriceCustomMessage(
  price,
  {minValue = CONSTANTS.MILLION, messageCode = Message.MRG_ERR_017} = {},
) {
  const parsePrice = NumberUtils.parseIntValue(price);
  if (ValidateInput.isEmpty(price)) {
    return translate(Message.MRG_ERR_001);
  } else if (parsePrice < minValue) {
    return translate(messageCode);
  }

  return '';
}

const ValidateInputMessage = {
  checkRequiredFieldMessage,
  checkRequiredFieldMessageWithMinLength,
  checkRequiredMinPrice,
  checkRequiredMinPriceCustomMessage,
};

export default ValidateInputMessage;
