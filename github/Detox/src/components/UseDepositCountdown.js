import {useEffect, useState} from 'react';

import {CONSTANTS} from '../assets/constants';
import useCheckBookingDepositAPI from '../screens/BookingDeposit/useCheckBookingDepositAPI';
import {CheckDateActiveInRange} from '../utils/UserTimer';

export const INITIAL_COUNTDOWN_STATE = {
  bookingTransactionId: '',
  dateStart: CONSTANTS.DEFAULT_INIT_TIMESTAMP,
  dateEnd: CONSTANTS.DEFAULT_INIT_TIMESTAMP,
};

const useDepositCountdown = ({
  bookingTransactionId,
  dateStart,
  dateEnd,
  shouldCheckStart = true,
  shouldCheckEnd = true,
  onTimeEnd = () => {},
  onTimeStart = () => {},
}) => {
  const [canDepositStart, setCanDepositStart] = useState(null);
  const [canDepositEnd, setCanDepositEnd] = useState(null);
  const [started, setStarted] = useState(false);

  const onGetDepositeDuration = depositeDuration => {
    const ableConfirmDeposite = depositeDuration?.ableConfirmDeposite ?? false;

    if (!started) {
      setCanDepositStart(ableConfirmDeposite);
      setStarted(true);
      onTimeStart(ableConfirmDeposite);
    } else {
      setCanDepositEnd(ableConfirmDeposite);
      onTimeEnd(ableConfirmDeposite);
    }
  };

  const {getDepositeDuration} = useCheckBookingDepositAPI({
    bookingTransactionId,
    onSuccessDepositeDuration: onGetDepositeDuration,
  });

  const onTimeCountStart = () => {
    if (shouldCheckStart) {
      getDepositeDuration();
    } else {
      setStarted(true);
    }
  };

  const onTimeCountEnd = () => {
    shouldCheckEnd ? getDepositeDuration() : onTimeEnd(false);
  };

  const {startCount, cancelCountTime} = CheckDateActiveInRange({
    dateStart: dateStart,
    dateEnd: dateEnd,
    onTimeEnd: onTimeCountEnd,
    onTimeStart: onTimeCountStart,
  });

  const startDepositCount = () => {
    startCount();
  };

  useEffect(() => {
    if (shouldCheckStart && started && !canDepositStart) {
      cancelCountTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, canDepositStart]);

  return {canDepositStart, canDepositEnd, startDepositCount, cancelCountTime};
};

export default useDepositCountdown;
