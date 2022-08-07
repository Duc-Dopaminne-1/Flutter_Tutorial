import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, ViewStyle, View, TextStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { ProgressCircle } from 'react-native-svg-charts';
import DefaultText from '@/components/CustomText/DefaultText';

const SECONDS_STEP = 1; //

const display = seconds => {
  const format = val => `0${Math.floor(val)}`.slice(-2);
  const minutes = (seconds % 3600) / 60;
  return [minutes, seconds % 60].map(format).join(':');
};

interface Props {
  countDownSeconds?: number;
  countDownCompleted?: () => void;
  timeMeet?: number;
}

export default function ProgressCircleView(props: Props): ReactElement {
  const { countDownSeconds = 1800, countDownCompleted = () => {}, timeMeet } = props;

  const [currentCounntDown, setCurrentCounntDown] = useState(0);

  useEffect(() => {
    setCurrentCounntDown(countDownSeconds);
  }, [countDownSeconds]);

  useEffect(() => {
    let timer = setInterval(() => {
      setCurrentCounntDown(lastTimerCount => {
        return calculatorTime(lastTimerCount, timer);
      });
    }, SECONDS_STEP * 1000);
    return () => {
      clearInterval(timer);
      timer = null;
    };
  });

  const calculatorTime = (newSeconds: number, timer: any) => {
    if (newSeconds < 1) {
      clearInterval(timer);
      timer = null;
      setTimeout(() => {
        countDownCompleted && countDownCompleted();
      }, 100);
      return 0;
    } else {
      return newSeconds - SECONDS_STEP;
    }
  };

  return (
    <View style={styles.progressWrapper}>
      <ProgressCircle
        style={styles.progressView}
        progress={currentCounntDown / timeMeet}
        progressColor={colors.red_700}
        backgroundColor={colors.red_200}
        strokeWidth={12}
      />
      <DefaultText {...{ style: styles.countDownText }}>{display(currentCounntDown)}</DefaultText>
    </View>
  );
}

const styles = StyleSheet.create({
  progressWrapper: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  progressView: {
    width: 200,
    height: 200,
  } as ViewStyle,

  countDownText: {
    position: 'absolute',
    fontSize: fonts.size.s40,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
    textAlign: 'center',
  } as TextStyle,
});
