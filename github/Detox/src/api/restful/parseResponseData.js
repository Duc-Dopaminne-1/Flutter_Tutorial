import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';

function parseResponseData(results) {
  const responseStatus = results?.status;
  if (responseStatus && responseStatus >= 200 && responseStatus < 400) {
    return {isSuccess: true, data: results.data};
  }

  const message = results?.data?.message || translate(Message.NTW_UNKNOWN_ERROR);
  return {isSuccess: false, data: {message}};
}

export {parseResponseData};
