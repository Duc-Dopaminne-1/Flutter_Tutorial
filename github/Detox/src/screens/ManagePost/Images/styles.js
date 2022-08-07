import {Dimensions, StyleSheet} from 'react-native';

import {CONSTANTS} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {medium, METRICS, normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';

const screen = Dimensions.get('screen');

const numberImagePerRow = 3;

const styles = StyleSheet.create({
  viewContainer: {
    ...HELPERS.fill,
    padding: normal,
  },
  descriptionContainer: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: 5,
    borderColor: COLORS.PRIMARY_A100,
  },
  frameContainer: {
    ...HELPERS.rowCenter,
    ...METRICS.marginTop,
    ...METRICS.verticalPadding,
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.SELECTED_AREA,
    borderStyle: 'dashed',
  },
  textUpload: {
    ...FONTS.semiBold,
    color: COLORS.PRIMARY_A100,
    fontSize: SIZES.FONT_14,
  },
  descriptionTitle: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.TEXT_DARK_10,
  },
  labelContainer: {
    paddingTop: 8,
  },
  labelText: {
    ...FONTS.semiBold,
    color: COLORS.TEXT_DARK_10,
    fontSize: SIZES.FONT_16,
  },
  uploadedImage: {
    margin: 4,
    width: (screen.width - 60) / numberImagePerRow,
    height: (screen.width - 60) / numberImagePerRow,
  },
  closeIcon: {
    position: 'absolute',
    top: 2,
    right: 4,
    width: 44,
    height: 44,
    alignItems: 'flex-end',
  },
  editIcon: {
    position: 'absolute',
    bottom: 2,
    paddingTop: SIZES.PADDING_16,
    right: 4,
    width: 44,
    height: 44,
    alignItems: 'flex-end',
  },
  shadow: {
    shadowColor: COLORS.PRIMARY_A100,
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowOffset: {
      width: 1, // These can't both be 0
      height: 1, // i.e. the shadow has to be offset in some way
    },
  },
  buttonUpload: {
    backgroundColor: COLORS.SELECTED_AREA,
  },
  selectAvatarContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  selectAvatarButton: {
    ...HELPERS.row,
    alignItems: 'center',
  },
  selectPropertyAvatarImage: {
    width: 24,
    height: 21,
    tintColor: COLORS.PRIMARY_A100,
  },
  selectAvatarText: {
    color: COLORS.PRIMARY_A100,
    fontSize: SIZES.FONT_14,
    fontWeight: '600',
  },
  disableSelectPropertyAvatarImage: {
    tintColor: COLORS.GREY_92,
  },
  disableSelectPropertyAvatarText: {
    color: COLORS.GREY_92,
  },
  separatorRow30: {
    height: 30,
  },
  confirmText: {
    width: '100%',
    ...FONTS.fontSize14,
    ...FONTS.regular,
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 18,
    color: COLORS.BLACK_33,
  },
  modalContainer: {
    width: '100%',
    ...METRICS.horizontalPadding,
    paddingBottom: 40,
  },
  footerButtonsContainer: {
    flexDirection: 'column',
  },
  footerCancelButton: {
    marginStart: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    ...HELPERS.center,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  footerNextButton: {
    backgroundColor: COLORS.GREY_ED,
  },
  cancelEditText: {
    color: COLORS.NEUTRAL_WHITE,
  },
  nextEditText: {
    color: COLORS.BLACK_33,
  },
  inputRightContainer: {
    justifyContent: 'center',
    height: '100%',
  },
  inputContainer: {
    ...commonStyles.inputBorderWithIcon,
    ...METRICS.smallHorizontalPadding,
    ...METRICS.paddingLeft,
    backgroundColor: COLORS.GREY_ED,
    height: 48,
  },
  inputStyle: {backgroundColor: COLORS.GREY_ED},
  buttonStreetView: {
    height: '100%',
    ...commonStyles.buttonNext,
    ...METRICS.horizontalPadding,
    ...METRICS.resetPaddingVertical,
    backgroundColor: COLORS.PRIMARY_A100,
    marginStart: small,
  },
  inputTitleCaptcha: {
    fontSize: 20,
  },
  captchaContainer: {borderWidth: SIZES.BORDER_WIDTH_1, borderColor: COLORS.GRAY_C9},
  cancelStyle: {backgroundColor: COLORS.GREY_ED, borderColor: COLORS.GREY_ED},
  cancelTextStyle: {color: COLORS.BLACK_33},
  checkboxContainerStyle: {
    ...commonStyles.rowCheckBox,
    height: '100%',
  },
  previewButton: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    borderRadius: 5,
    paddingVertical: SIZES.PADDING_8,
  },
  textPreviewButton: {
    ...FONTS.fontSize16,
    color: COLORS.PRIMARY_A100,
  },
  textInput: {
    ...commonStyles.inputBorderStyle,
    ...commonStyles.blackText16,
  },
  textInputDescription: {
    ...commonStyles.inputBorderStyle,
    height: CONSTANTS.INPUT_DESCRIPTION_HEIGHT,
  },
  gestureHandlerView: {zIndex: 1},
  otherServicesList: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingTop: small,
  },
  itemStyle: {
    ...METRICS.smallVerticalPadding,
    width: SCREEN_SIZE.WIDTH - medium * 2,
  },
});

export default styles;
