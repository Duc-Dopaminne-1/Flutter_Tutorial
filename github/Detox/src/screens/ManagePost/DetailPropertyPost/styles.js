import {StyleSheet} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';

const styles = StyleSheet.create({
  sectionText: {
    ...FONTS.semiBold,
    fontSize: 13,
    color: COLORS.BLACK_33,
  },
  smallText: {
    marginTop: SIZES.MARGIN_8,
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.BLACK_4F,
  },
  dropdown: {
    ...commonStyles.dropdown,
    width: '24%',
    marginStart: normal,
  },
  commissionUnit: {
    ...commonStyles.dropdown,
    width: '24%',
    marginStart: normal,
    justifyContent: 'center',
  },
  errorText: {
    ...FONTS.regular,
    paddingTop: 2,
    color: COLORS.STATE_ERROR,
    fontSize: 12,
  },
  checkBoxText: {
    ...FONTS.regular,
    ...METRICS.smallHorizontalMargin,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
  },
  container: {
    flex: 1,
    ...METRICS.resetMargin,
  },
  containerSelection: {
    flex: 1,
    ...METRICS.marginTop,
  },
  customInput: {
    ...commonStyles.inputStyle,
    minWidth: '32%',
    textAlign: 'center',
  },
  input: focused => ({
    ...commonStyles.inputBorderWithIcon,
    fontSize: SIZES.FONT_16,
    ...(focused && {borderColor: COLORS.PRIMARY_A100}),
  }),
});

export default styles;
