// @flow
import {PROJECT_STATUS, TRANSACTION_MODE} from '../../assets/constants';
import {getNowTimeStamp} from '../../utils/TimerCommon';

export const getTransactionStatusByTime = projectDetail => {
  const saleSeasonInfo = projectDetail?.saleSeasonInfo;
  const projectStatusName = projectDetail?.projectStatusName;
  if (!saleSeasonInfo?.saleSeasonId) {
    return TRANSACTION_MODE.NOTHING;
  }
  //check project status first - sold project will not have deposit & booking action
  if (projectStatusName === PROJECT_STATUS.SOLD) {
    return TRANSACTION_MODE.NOTHING;
  }

  const now = getNowTimeStamp();
  if (saleSeasonInfo.startBookingDatetime <= now && now < saleSeasonInfo.openDatetime) {
    return TRANSACTION_MODE.BOOKING;
  }
  if (saleSeasonInfo.openDatetime <= now && now <= saleSeasonInfo.closeDatetime) {
    return TRANSACTION_MODE.DEPOSIT;
  }
  if (now >= saleSeasonInfo.closeDatetime) {
    return TRANSACTION_MODE.DEPOSIT;
  }
  return TRANSACTION_MODE.NOTHING;
};
