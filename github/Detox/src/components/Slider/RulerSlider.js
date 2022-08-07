import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {SizeBox} from '../SizeBox';

const RulerSlider = ({array = [], min = 0, max = 0, currentValues = []}) => {
  const styleEvenNumber = value => {
    let result = {flex: 0.9, textAlign: 'center', color: COLORS.GRAY_C9};
    if (value === min) {
      result = {...result, flex: 0.5, textAlign: 'left'};
    }
    if (value === max) {
      result = {...result, flex: 0.5, textAlign: 'right'};
    }
    if (currentValues.length !== 1) {
      if (value >= currentValues[0] && value <= currentValues[1]) {
        return (result = {...result, color: COLORS.PRIMARY_A100});
      } else {
        return (result = {...result, color: COLORS.GRAY_C9});
      }
    }
    return result;
  };

  return (
    <>
      <View style={styles.wrapperRuler}>
        {array.map(e => {
          const {color} = styleEvenNumber(e);
          if (e % 10 === min || e === min) {
            return <SizeBox key={e.toString()} height={20} width={1} backgroundColor={color} />;
          }
          return <SizeBox key={e.toString()} height={10} width={1} backgroundColor={color} />;
        })}
      </View>
      <View style={[styles.wrapperEvenRuler]}>
        {array.map(e => {
          const {flex, textAlign, color} = styleEvenNumber(e);
          if (e % 10 === min || e === min) {
            return (
              <Text key={e.toString()} style={styles.valueRuler(flex, textAlign, color)}>
                {e === max ? `${e}+` : e}
              </Text>
            );
          }
        })}
      </View>
    </>
  );
};

export default RulerSlider;

const styles = StyleSheet.create({
  wrapperRuler: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapperEvenRuler: {
    width: '102%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  valueRuler: (flex, textAlign, color) => ({
    ...FONTS.bold,
    fontSize: 12,
    flex,
    textAlign,
    color,
  }),
});
