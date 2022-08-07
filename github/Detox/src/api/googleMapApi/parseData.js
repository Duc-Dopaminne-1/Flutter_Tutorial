import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';

const SUCCESS_STATUS = 'OK';

function parseData(result) {
  const dataStatus = result?.data?.status;
  if (dataStatus && dataStatus === SUCCESS_STATUS) {
    return {isSuccess: true, data: result.data};
  }

  const message = result?.data.error_message || translate(Message.NTW_UNKNOWN_ERROR);
  return {isSuccess: false, data: {message}};
}

export {parseData};
