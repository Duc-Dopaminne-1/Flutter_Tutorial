import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';

import {CONSTANTS} from '../assets/constants';

export const useCountDownToNow = ({
  dateEnd = Date(),
  onChangeTime = () => {},
  onFinish = () => {},
}) => {
  const [timeLeft, setTimeLeft] = useState(dateEnd); /// timeLeft in seconds

  useEffect(() => {
    setTimeLeft(dateEnd);
  }, [dateEnd]);

  const getTextFromTimeLeft = timeRemain => {
    if (timeRemain < 1) {
      return '00:00';
    }
    const minutes = Math.floor(timeRemain / CONSTANTS.MINUTE_IN_SECOND);
    let textMinutes = `${minutes}`;
    if (minutes < 10) {
      textMinutes = '0' + textMinutes;
    }
    const seconds = Math.floor(timeRemain % CONSTANTS.MINUTE_IN_SECOND);
    let textSeconds = `${seconds}`;
    if (seconds < 10) {
      textSeconds = '0' + textSeconds;
    }
    return `${textMinutes}:${textSeconds}`;
  };

  useEffect(() => {
    onChangeTime(timeLeft);
    let timeOut = null;
    if (timeLeft > 0) {
      timeOut = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, CONSTANTS.SECOND_IN_MILLISECOND);
    } else {
      onFinish();
    }
    return () => {
      timeOut && clearTimeout(timeOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  return getTextFromTimeLeft(timeLeft);
};

const TimerCountDownToNowText = ({dateEnd, onChangeTime, onFinish, textStyle}) => {
  const time = useCountDownToNow({dateEnd, onChangeTime, onFinish});
  return <Text style={textStyle}>{time}</Text>;
};

TimerCountDownToNowText.propTypes = {
  onChangeText: PropTypes.func,
  onFinish: PropTypes.func,
  textStyle: Text.propTypes.style,
};

TimerCountDownToNowText.defaultProps = {
  dateEnd: Date(),
  onChangeTime: () => {},
  onFinish: () => {},
};

export default TimerCountDownToNowText;
