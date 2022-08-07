import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {CONSTANTS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {tiny} from '../assets/theme/metric';
import CustomCheckbox from './Checkbox/CustomCheckbox';

const styles = StyleSheet.create({
  label: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.TEXT_DARK_10,
  },
  body: {
    alignItems: 'center',
    paddingVertical: tiny,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  linkText: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.PRIMARY_A100,
    textDecorationLine: 'underline',
  },
  checkBox: {
    width: 30,
    height: 30,
  },
  agreement: {
    flex: 1,
    textAlign: 'justify',
  },
});
const CustomAgreementComponent = ({
  containerStyle,
  checkValue,
  onConfirm,
  isAgree,
  suffix,
  hyperlink,
  agreementFistText = translate(STRINGS.AGREEMENT_FIRST),
}) => {
  return (
    <View style={[HELPERS.row, styles.body, containerStyle]}>
      <CustomCheckbox
        images={['checkbox', 'checkbox-blank-outline']}
        customCheckedBox
        iconCheckedColor={COLORS.PRIMARY_A100}
        iconColor={COLORS.GRAY_C9}
        parentCheckedValue={isAgree}
        checkValue={checkValue}
        style={styles.checkBox}
        hitSlop={CONSTANTS.HIT_SLOP_HORIZONTAL}
      />
      <Text style={[HELPERS.rowWrap, styles.agreement]}>
        <Text style={styles.label}>{agreementFistText}</Text>
        <Text style={styles.linkText} onPress={onConfirm}>
          {hyperlink}
        </Text>
        <Text style={styles.label}>{suffix} </Text>
      </Text>
    </View>
  );
};

export default CustomAgreementComponent;
