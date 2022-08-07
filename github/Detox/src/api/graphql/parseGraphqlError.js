import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import logService from '../../service/logService';
import {handleUnAuthorizedRequest} from '../authApi';

function parseGraphqlError(error) {
  logService.log('parseGraphqlError', error);
  let message = translate(Message.NTW_UNKNOWN_ERROR);
  if (!error) {
    return message;
  }

  const networkError = error.networkError;
  if (networkError) {
    //check for unauthorized due to change password elsewhere
    if (networkError.statusCode === 401) {
      handleUnAuthorizedRequest();
      return translate(Message.EXPIRED_AUTHORIZATION);
    }
    if (networkError.statusCode >= 500) {
      return translate(Message.NTW_SERVER_ERROR);
    }
    return translate(Message.NTW_NETWORK_ERROR);
  }

  if (error.message) {
    return translate(Message.NTW_UNKNOWN_ERROR);
  }

  const errors = error.graphQLErrors;
  message = errors && errors.length > 0 ? errors[0].message : null;
  return message;
}

export {parseGraphqlError};
