import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';

function parseResponseError(error) {
  let message = translate(Message.NTW_UNKNOWN_ERROR);
  let messageCode = '';
  let messageKey = '';
  if (!error) {
    return {isSuccess: false, data: {message}};
  }

  const response = error.response;
  if (!response) {
    return {isSuccess: false, data: {message: translate(Message.NTW_NETWORK_ERROR)}};
  }

  if (!response.status) {
    return {isSuccess: false, data: {message: translate(Message.NTW_NETWORK_ERROR)}};
  }

  switch (response.status) {
    case 401:
      message = translate(Message.UNAUTHOR_ERROR);
      break;
    case 404:
      message = translate(Message.NTW_WRONG_REQUEST);
      break;
    case 500:
      message = translate(Message.NTW_SERVER_ERROR);
      break;

    case 413:
      message = translate(Message.IMAGE_TOO_LARGE);
      break;

    default:
      const errors = response?.data?.errors || response?.data?.value?.errors;
      if (errors && errors.length > 0) {
        message = translate(errors[0].message);
        messageCode = errors[0].message;
        messageKey = errors[0].key;
      } else {
        message = null;
      }

      break;
  }

  if (!message) {
    // manually localized error message for identity server error due to backend has not done yet
    const messageError = response?.data?.error_description || response?.data?.error;
    if (messageError) {
      message = translate(messageError);
      messageKey = response?.data?.TokenDeactiveUser;
    }
  }

  if (!message) {
    message = translate(Message.NTW_UNKNOWN_ERROR);
  }

  return {isSuccess: false, data: {message, messageCode, messageKey}};
}

export {parseResponseError};
