import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, View, ViewPropTypes} from 'react-native';

import {IMAGES} from '../assets/images';
import {FONTS} from '../assets/theme/fonts';
import {small, tiny} from '../assets/theme/metric';
import TimerCountDownToNowText from './TimerCountDownToNowText';

const styles = StyleSheet.create({
  viewCountDown: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: small,
  },
  imageHour: {
    width: 15,
    height: 15,
    marginRight: tiny,
  },
  textCountDown: {
    ...FONTS.bold,
    fontSize: 16,
  },
});

const CountDownTimeComponent = ({dateEnd, textStyle, style, onChangeTime}) => {
  return (
    <View style={[styles.viewCountDown, style]}>
      <Image style={styles.imageHour} source={IMAGES.IC_HOUR_GLASS} />
      <TimerCountDownToNowText
        dateEnd={dateEnd}
        textStyle={[styles.textCountDown, textStyle]}
        onChangeTime={onChangeTime}
      />
    </View>
  );
};

CountDownTimeComponent.propTypes = {
  style: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  onChangeTime: PropTypes.func,
};

CountDownTimeComponent.defaultProps = {
  onChangeTime: () => {},
};

export default CountDownTimeComponent;
