import {translate} from '../../../assets/localize';

export const REQUEST_STATUS = {
  RequestNew: 'RequestNew',
  RequestPending: 'RequestPending',
  RequestProcessing: 'RequestProcessing',
  RequestProcessed: 'RequestProcessed',
  RequestClosed: 'RequestClosed',
  RequestOnHold: 'RequestOnHold',
  RequestCancelled: 'RequestCancelled',
};

export const getDataByStatusName = statusName => {
  const textColor = '#FFFFFF';
  let backgroundColor = null;
  let step = null;
  let description = '';
  let disabledCancel = true;

  switch (statusName) {
    case REQUEST_STATUS.RequestNew:
      description = translate('contactAdvice.status.RequestNew');
      step = 0;
      backgroundColor = '#2BCCAE';
      disabledCancel = false;
      break;
    case REQUEST_STATUS.RequestPending:
      description = translate('contactAdvice.status.RequestPending');
      step = 1;
      backgroundColor = '#FF951F';
      disabledCancel = false;
      break;
    case REQUEST_STATUS.RequestProcessing:
      description = translate('contactAdvice.status.RequestProcessing');
      step = 2;
      backgroundColor = '#3360FF';
      disabledCancel = false;
      break;
    case REQUEST_STATUS.RequestCancelled:
      description = translate('contactAdvice.status.RequestCancelled');
      step = 2;
      backgroundColor = '#E94545';
      break;
    case REQUEST_STATUS.RequestProcessed:
      description = translate('contactAdvice.status.RequestProcessed');
      step = 3;
      backgroundColor = '#37BF2A';
      break;
    case REQUEST_STATUS.RequestClosed:
      description = translate('contactAdvice.status.RequestClosed');
      step = 4;
      backgroundColor = '#A3A3A3';
      break;
    default:
      break;
  }

  return {
    description,
    textColor,
    backgroundColor,
    step,
    disabledCancel,
  };
};
