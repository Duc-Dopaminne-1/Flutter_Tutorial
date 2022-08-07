import {StyleSheet} from 'react-native';

import {CONSTANTS} from '../constants';
import {SIZES} from '../constants/sizes';
import {COLORS} from './colors';
import {FONTS} from './fonts';
import {medium, METRICS, normal, normalMedium, small, smallNormal, tiny} from './metric';

export const commonStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  tabIcon: {
    color: COLORS.PRIMARY_A100,
    fontSize: 24,
  },
  dropdown: {
    borderRadius: SIZES.BORDER_RADIUS_8,
    marginTop: 8,
    borderWidth: 0,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingHorizontal: CONSTANTS.INPUT_PADDING_HORIZONTAL,
    minHeight: CONSTANTS.INPUT_HEIGHT,
    paddingVertical: 0,
  },
  borderedInput: {
    ...FONTS.regular,
    paddingVertical: 8,
    marginTop: 8,
    borderRadius: SIZES.BORDER_RADIUS_8,
    paddingHorizontal: 8,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    minHeight: CONSTANTS.INPUT_HEIGHT,
  },
  confirmContainer: {
    marginVertical: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: 5,
    borderColor: COLORS.PRIMARY_A100,
    borderWidth: SIZES.BORDER_WIDTH_1,
  },
  confirmText: {
    ...FONTS.bold,
    color: COLORS.NEUTRAL_WHITE,
    fontSize: 14,
  },
  greyBorderContainer: {
    marginVertical: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.TEXT_DARK_40,
  },
  greyText: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
    fontSize: 14,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 5,
    top: 20,
    // backgroundColor: 'red',
    zIndex: 1,
    height: 22,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...FONTS.regular,
    color: COLORS.STATE_ERROR,
    fontSize: 12,
  },
  buttonNext: {
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: SIZES.BORDER_RADIUS_8,
    paddingVertical: 13,
  },
  buttonOutline: {
    borderRadius: 5,
    marginTop: 8,
    paddingTop: 10,
    paddingBottom: 12,
    borderColor: COLORS.TEXT_DARK_40,
    borderWidth: SIZES.BORDER_WIDTH_1,
    backgroundColor: COLORS.TRANSPARENT,
  },
  buttonOutlineText: {
    color: COLORS.BLACK_4F,
  },
  disabledButtonNext: {
    backgroundColor: COLORS.TEXT_DARK_60,
    borderRadius: 5,
    marginTop: small,
    paddingTop: 10,
    paddingBottom: 12,
  },
  whiteBoxDropdown: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: 0,
    borderRadius: CONSTANTS.INPUT_BORDER_RADIUS,
    paddingLeft: small,
  },
  buttonNextConfirm: {
    width: '30%',
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 12,
    marginEnd: normal,
  },
  buttonConfirm: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.BORDER_RADIUS_8,
    backgroundColor: COLORS.PRIMARY_A100,
    height: 48,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 12,
  },
  disabledButtonConfirm: {
    backgroundColor: COLORS.TEXT_DARK_40,
    borderRadius: 5,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 12,
  },
  enableColorButton: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  disabledColorButton: {
    backgroundColor: COLORS.TEXT_DARK_40,
  },
  buttonDismiss: {
    width: 15,
    height: 15,
    alignSelf: 'center',
  },
  viewFirstRow: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: normal,
  },
  textInputDescription: {
    minHeight: 64,
  },
  textInput: {
    minHeight: CONSTANTS.INPUT_HEIGHT,
  },
  requiredSymbol: {
    color: COLORS.STATE_ERROR,
  },
  footerContainerStyle: {
    padding: normal,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  shadowApp: {
    shadowColor: COLORS.SHADOWN,
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 1,
  },
  footerContainer: {
    padding: normal,
    flexDirection: 'row',
    shadowColor: COLORS.SHADOWN,
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.02,
    shadowRadius: 30,
    elevation: 5,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  inputBorder: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    paddingLeft: 10,
    borderColor: COLORS.NEUTRAL_BORDER,
  },
  shadowBoxSubscription: {
    shadowColor: COLORS.DEFAULT_SHADOW_COLOR,
    shadowOffset: {
      width: 1,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 9.51,

    elevation: 2,
  },
  separatorRow4: {
    height: tiny,
    width: '100%',
  },
  separatorRow6: {
    height: 6,
  },
  separatorRow8: {
    height: small,
  },
  separatorRow12: {
    height: smallNormal,
  },
  separatorRow16: {
    height: normal,
  },
  separatorRow24: {
    height: normalMedium,
  },
  separatorRow32: {
    height: medium,
  },
  separatorColumn8: {
    width: small,
  },
  separatorColumn4: {
    width: tiny,
  },
  separatorColumn12: {
    width: smallNormal,
  },
  separatorColumn16: {
    width: normal,
  },
  separatorColumn24: {
    width: normalMedium,
  },
  separatorColumn32: {
    width: medium,
  },
  sectionSeparatorLine: {
    height: 8,
    width: '100%',
    backgroundColor: COLORS.BACKGROUND,
  },
  separatorRow8WithColor: {
    height: small,
    width: '100%',
    backgroundColor: COLORS.BACKGROUND,
  },
  borderRadius30: {
    borderRadius: 30,
  },
  borderRadius4: {
    borderRadius: 4,
  },
  txtFontSize12: {
    ...FONTS.fontSize12,
    ...FONTS.regular,
    color: COLORS.BLACK_31,
  },
  txtFontSize14: {
    ...FONTS.fontSize14,
    ...FONTS.regular,
    color: COLORS.BLACK_31,
  },
  txtFontSize16: {
    ...FONTS.fontSize16,
    ...FONTS.regular,
    color: COLORS.BLACK_31,
  },
  input: {
    height: CONSTANTS.INPUT_HEIGHT,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    marginTop: small,
    paddingHorizontal: 15,
  },
  multilineInput: {
    width: '100%',
    height: 110,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GRAY_C9,
    borderRadius: SIZES.BORDER_RADIUS_8,
    ...METRICS.horizontalPadding,
    paddingTop: 8,
    justifyContent: 'flex-start',
  },
  overlapView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputBorderStyle: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    height: CONSTANTS.INPUT_HEIGHT,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: CONSTANTS.INPUT_BORDER_RADIUS,
    borderColor: COLORS.GREY_E4,
    marginTop: small,
    paddingHorizontal: CONSTANTS.INPUT_PADDING_15,
    paddingLeft: CONSTANTS.INPUT_PADDING_15,
    overflow: 'hidden',
  },
  inputStyle: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    height: CONSTANTS.INPUT_HEIGHT,
    borderWidth: 0,
    paddingHorizontal: CONSTANTS.INPUT_PADDING_15,
  },
  inputBorderWithIcon: {
    height: CONSTANTS.INPUT_HEIGHT,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: CONSTANTS.INPUT_BORDER_RADIUS,
    borderColor: COLORS.GREY_E4,
    paddingHorizontal: CONSTANTS.INPUT_PADDING_15,
    overflow: 'hidden',
  },
  componentInput: {
    width: 31,
    height: 25,
    borderRadius: 5,
    overflow: 'hidden',
  },
  dropdownHeader: {
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
  },
  dropdownPlaceHolder: {
    ...FONTS.fontSize14,
    color: COLORS.TEXT_DARK_10,
  },
  dropdownInput: {
    ...METRICS.paddingLeft,
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    marginTop: 8,
  },
  dropdownDisabled: {
    backgroundColor: COLORS.GREY_ED,
    ...METRICS.paddingLeft,
  },
  borderApp: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.LINE_COLOR,
  },
  borderMain: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: COLORS.GREY_F0,
  },
  disableBackground: {
    backgroundColor: COLORS.SELECTED_AREA,
  },
  statusContainer: {
    backgroundColor: COLORS.BLUE_56,
    padding: small,
    borderRadius: SIZES.BORDER_RADIUS_20,
  },
  statusText: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.NEUTRAL_WHITE,
    marginHorizontal: small,
  },
  radioSelectedPrimary: {
    width: 20,
    height: 20,
    borderRadius: 10,
    padding: 1,
    borderWidth: SIZES.BORDER_WIDTH_6,
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    padding: 1,
    borderWidth: SIZES.BORDER_WIDTH_2,
    borderColor: COLORS.GREY_E4,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  inputSearch: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GRAY_C9,
    marginLeft: 16,
    borderRadius: SIZES.BORDER_RADIUS_8,
    overflow: 'hidden',
  },
  headerBarShadowContainer: {
    // paddingBottom: normal,
    overflow: 'hidden',
  },
  headerBarShadow: {
    height: 1,
    backgroundColor: COLORS.BACKGROUND,
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.5,
    shadowColor: COLORS.TEXT_DARK_10,
    shadowRadius: 4,
    elevation: 3,
  },
  separatorLine: {height: 1, width: '100%', backgroundColor: COLORS.GREY_F0},

  // TEXT STYLE
  blackText12: {...FONTS.fontSize12, ...FONTS.regular, color: COLORS.BLACK_33},
  grayText12: {...FONTS.fontSize12, ...FONTS.regular, color: COLORS.GRAY_A3},
  grayText14: {...FONTS.regular, color: COLORS.BRAND_GREY, ...FONTS.fontSize14},
  blackText14: {...FONTS.regular, color: COLORS.BLACK_33, ...FONTS.fontSize14},
  blackText16: {...FONTS.regular, color: COLORS.BLACK_33, ...FONTS.fontSize16},
  blackTextBold12: {...FONTS.bold, color: COLORS.BLACK_33, ...FONTS.fontSize12},
  whiteText14: {...FONTS.fontSize14, ...FONTS.regular, color: COLORS.NEUTRAL_WHITE},
  blackTextBold14: {...FONTS.bold, color: COLORS.BLACK_33, ...FONTS.fontSize14},
  blackTextBold16: {...FONTS.bold, color: COLORS.BLACK_33, ...FONTS.fontSize16},
  blackTextBold20: {fontSize: 20, ...FONTS.bold, color: COLORS.BLACK_33},
  blackTextBold24: {fontSize: 24, ...FONTS.bold, color: COLORS.BLACK_33},
  blackText20: {fontSize: 20, ...FONTS.regular, color: COLORS.BLACK_33},
  mainColorText14: {...FONTS.regular, color: COLORS.PRIMARY_A100, ...FONTS.fontSize14},
  mainColorTextBold14: {...FONTS.bold, color: COLORS.PRIMARY_A100, ...FONTS.fontSize14},
  subColorText12: {...FONTS.regular, color: COLORS.PRIMARY_B100, ...FONTS.fontSize12},
  subColorText14: {...FONTS.regular, color: COLORS.PRIMARY_B100, ...FONTS.fontSize14},
  subColorTextBold14: {...FONTS.bold, color: COLORS.PRIMARY_B100, ...FONTS.fontSize14},
  subColorTextBold20: {fontSize: 20, ...FONTS.bold, color: COLORS.PRIMARY_B100},
  placeholderText14: {...FONTS.regular, color: COLORS.TEXT_DARK_40, ...FONTS.fontSize14},
  placeholderText16: {...FONTS.regular, color: COLORS.TEXT_DARK_40, ...FONTS.fontSize16},

  link: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.PRIMARY_A100,
    textDecorationLine: 'underline',
    alignSelf: 'flex-start',
  },
  downloadIcon: {alignSelf: 'center'},

  primaryBackgroundColor: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  primaryDisableBackgroundColor: {
    backgroundColor: COLORS.PRIMARY_A20,
  },
  whiteBackground: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  rowCheckBox: {
    flex: 1,
    flexDirection: 'row',
    marginTop: small,
    alignItems: 'center',
    height: CONSTANTS.ITEM_HEIGHT,
  },
  borderDashed: {
    borderStyle: 'dashed',
  },
});
