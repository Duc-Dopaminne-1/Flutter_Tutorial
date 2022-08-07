import moment from 'moment';
import {useEffect, useState} from 'react';

import {CONSTANTS} from '../assets/constants';

const CheckDateActiveInRange = ({
  dateStart = Date(),
  dateEnd = Date(),
  onTimeStart = () => {},
  onTimeEnd = () => {},
}) => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(null);
  const [cancelCount, setCancelCount] = useState(false);

  useEffect(() => {
    if (!time || cancelCount) {
      return;
    }
    let timeOut = null;
    const {upToTime, remainTime} = time;
    if (upToTime >= 1) {
      // open time doesnot come yet
      setIsActive(false);
      timeOut = setTimeout(() => {
        setTime({
          upToTime: moment(dateStart).diff(moment(), 'seconds'),
          remainTime: moment(dateEnd).diff(moment(), 'seconds'),
        });
      }, CONSTANTS.SECOND_IN_MILLISECOND);
    } else if (time.upToTime < 1 && remainTime >= 1) {
      // Active time
      if (!time.calledTimeStart) {
        setIsActive(true);
        onTimeStart();
      }
      timeOut = setTimeout(() => {
        setTime({
          upToTime: 0,
          remainTime: moment(dateEnd).diff(moment(), 'seconds'),
          calledTimeStart: true,
        });
      }, CONSTANTS.SECOND_IN_MILLISECOND);
    } else if (remainTime < 1) {
      // Time is up
      setIsActive(false);
      onTimeEnd();
    }

    return () => {
      timeOut && clearTimeout(timeOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const startCount = () => {
    if (
      dateStart === CONSTANTS.DEFAULT_INIT_TIMESTAMP ||
      dateEnd === CONSTANTS.DEFAULT_INIT_TIMESTAMP
    ) {
      return;
    }
    setCancelCount(false);
    setTime({
      upToTime: moment(dateStart).diff(moment(), 'seconds'), // Time from now to dateStart;
      remainTime: moment(dateEnd).diff(moment(), 'seconds'),
      calledTimeStart: false, // Time remain to dateEnd;
    });
  };

  const cancelCountTime = () => {
    setCancelCount(true);
  };

  const checkTimerRunning = () => {
    return time && !cancelCount;
  };

  return {isActive, startCount, cancelCountTime, checkTimerRunning};
};

export {CheckDateActiveInRange};
