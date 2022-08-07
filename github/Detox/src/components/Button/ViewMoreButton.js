import React from 'react';
import {StyleSheet} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import CustomButton from './CustomButton';

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    borderRadius: 5,
    paddingVertical: 9,
    height: 41,
    paddingHorizontal: 16,
    marginHorizontal: 80,
  },
});

const ViewMoreButton = ({title = 'Xem tất cả', onPress}) => {
  return (
    <CustomButton
      onPress={onPress}
      titleColor={COLORS.PRIMARY_A100}
      titleStyle={{...FONTS.bold}}
      title={title}
      style={[styles.buttonStyle]}
    />
  );
};

export {ViewMoreButton};
