import moment from 'moment';

import {DAY_TO_MILISECOND, PAYMENT_METHODS} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';

export const getSubscriptionNextTStartDate = ({
  isCurrentSubscriptionPackagePremium,
  currentPackageEndTime,
  lastPackageEndTime,
}) => {
  const startOfTodayUTC = moment().utcOffset(0).startOf('day').valueOf();
  const isCurrentPackageExpired = currentPackageEndTime < startOfTodayUTC;
  return isCurrentSubscriptionPackagePremium && !isCurrentPackageExpired
    ? moment(lastPackageEndTime).utcOffset(0).startOf('day').add(1, 'days').valueOf() // in miliseconds
    : startOfTodayUTC;
};

export const calculatePackageValidDaysLeft = (endTime, isLastPackageActive) => {
  const todayToTimestamp = moment().valueOf(); // in miliseconds
  const timeLeft = endTime - todayToTimestamp; // in miliseconds
  const validDaysLeft =
    isLastPackageActive && timeLeft > 0 ? Math.ceil(timeLeft / DAY_TO_MILISECOND) : 0;
  return validDaysLeft;
};

export const mapSubscriptionPackageDetailToState = details => {
  if (!details) {
    return {};
  }
  const packageName = details.subscriptionPackageName ?? '';
  const packagePrice = details.subscriptionPackagePrice ?? 0;
  const packageValidDays = details.subscriptionPackageValidDays ?? 0;
  const packageId = details.subscriptionPackageId ?? 0;
  return {
    packageId,
    packageName,
    packagePrice,
    packageValidDays,
  };
};

export const SubscriptionPaymentOptions = [
  {
    id: PAYMENT_METHODS.transfer.id,
    title: translate(STRINGS.PAYMENT_ONLINE),
    isChecked: true,
  },
  {
    id: PAYMENT_METHODS.cash.id,
    title: translate(STRINGS.PAYMENT_CASH),
    isChecked: false,
  },
];
