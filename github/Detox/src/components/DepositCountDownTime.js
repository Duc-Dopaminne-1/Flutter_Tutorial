import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {CheckDateActiveInRange} from '../utils/UserTimer';
import CountDownTimeComponent from './CountDownTimeComponent';

const DepositCountDownTime = ({
  dateStart,
  dateEnd,
  textStyle,
  onChangeTime,
  onTimeEnd,
  onTimeStart,
}) => {
  const {isActive} = CheckDateActiveInRange({
    dateStart: dateStart,
    dateEnd: dateEnd,
    onTimeEnd: onTimeEnd,
    onTimeStart: onTimeStart,
  });

  return isActive ? (
    <CountDownTimeComponent dateEnd={dateEnd} textStyle={textStyle} onChangeTime={onChangeTime} />
  ) : (
    <View />
  );
};

DepositCountDownTime.propTypes = {
  textStyle: Text.propTypes.style,
  onChangeTime: PropTypes.func,
  onTimeEnd: PropTypes.func,
  onTimeStart: PropTypes.func,
};

DepositCountDownTime.defaultProps = {
  onChangeTime: () => {},
  onTimeEnd: () => {},
  onTimeStart: () => {},
};

export default DepositCountDownTime;
