import React from 'react';
import {StyleSheet, View} from 'react-native';

import {NEW_POST_STEP} from '../../../../assets/constants';
import {COLORS} from '../../../../assets/theme/colors';
import CircularProgress from '../../../SlotSelection/CircularProgress';

const styles = StyleSheet.create({
  container: {
    height: 48,
  },
  countStyle: {
    color: COLORS.PRIMARY_A100,
  },
});

const CircleProcessComponent = ({stepProcess = NEW_POST_STEP.STEP1}) => {
  let textCount = '1/4';
  switch (stepProcess) {
    case NEW_POST_STEP.STEP2:
      textCount = '2/4';
      break;
    case NEW_POST_STEP.STEP3:
      textCount = '3/4';
      break;
    case NEW_POST_STEP.STEP4:
      textCount = '4/4';
      break;
  }

  return (
    <View style={styles.container}>
      <CircularProgress
        total={4}
        count={stepProcess}
        textCount={textCount}
        countStyle={styles.countStyle}
        progressColor={COLORS.PRIMARY_A100}
      />
    </View>
  );
};

export default CircleProcessComponent;
