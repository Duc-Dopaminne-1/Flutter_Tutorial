import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';

import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {tiny} from '../../assets/theme/metric';
import {CIRCLE_RADIUS} from './SlotSelectionDimens';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.center,
    justifyContent: 'flex-start',
    flex: 1,
  },
  title: {
    ...FONTS.regular,
    fontSize: 11,
    marginTop: tiny,
  },
  count: {
    ...FONTS.semiBold,
    fontSize: 12,
  },
});

const CircularProgress = ({
  title,
  progressColor = COLORS.CIRCLE_BACKGROUND,
  total = 0,
  count = 0,
  containerStyle,
  borderWidth = 5,
  countStyle,
  textCount,
  bgColor = COLORS.NEUTRAL_WHITE,
}) => {
  const validTotal = total === 0 ? 1 : total;
  const percent = (count / validTotal) * 100;
  return (
    <View style={[styles.container, containerStyle]}>
      <ProgressCircle
        percent={percent}
        radius={CIRCLE_RADIUS}
        borderWidth={borderWidth}
        color={progressColor}
        shadowColor={COLORS.CIRCLE_BACKGROUND}
        bgColor={bgColor}>
        <Text style={[styles.count, countStyle]}>{`${textCount ? textCount : count}`}</Text>
      </ProgressCircle>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default CircularProgress;
