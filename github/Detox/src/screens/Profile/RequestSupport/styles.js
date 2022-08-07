import {StyleSheet} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {FONT_BOLD} from '../../../assets/fonts';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';

const consultationStyles = StyleSheet.create({
  // Containers
  container: {},
  sectionContainer: {
    ...METRICS.smallNormalVerticalPadding,
    ...METRICS.horizontalPadding,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  propertyPostContainer: {paddingHorizontal: 14},
  stepIndicatorContainer: {backgroundColor: COLORS.NEUTRAL_WHITE, paddingVertical: 12},

  // Text
  sectionHeader: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.BLACK_31,
  },
  emptyInfoText: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_31,
    textAlign: 'center',
  },

  //Icons
  emptyInfoIcon: {
    marginBottom: 12,
  },
  statusIcon: {
    width: 20,
  },
});

const requestResultStyles = StyleSheet.create({
  // Containers
  sectionContainer: {
    ...METRICS.normalMediumVerticalPadding,
    ...METRICS.horizontalPadding,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  validationLabel: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: SIZES.BORDER_RADIUS_100,
    alignSelf: 'flex-end',
    ...HELPERS.center,
  },

  // Text
  sectionHeader: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.BLACK_31,
  },
  inputHeader: {
    ...FONTS.regular,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
  },

  // Icons
  validationIcon: {
    height: 18,
    width: 18,
  },
  statusText: {
    ...FONTS.bold,
    color: COLORS.ORANGE_BASIC,
  },
});

const styleStepIndicator = {
  stepIndicatorSize: 16,
  currentStepIndicatorSize: 16,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: COLORS.PRIMARY_A100,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: COLORS.PRIMARY_A100,
  stepStrokeUnFinishedColor: COLORS.PRIMARY_A100,
  separatorFinishedColor: COLORS.PRIMARY_A100,
  separatorUnFinishedColor: COLORS.GRAY_ED,
  stepIndicatorFinishedColor: COLORS.PRIMARY_A100,
  stepIndicatorUnFinishedColor: COLORS.NEUTRAL_WHITE,
  stepIndicatorCurrentColor: COLORS.PRIMARY_A100,
  labelFontFamily: FONT_BOLD,
  stepIndicatorLabelCurrentColor: COLORS.TRANSPARENT,
  stepIndicatorLabelFinishedColor: COLORS.TRANSPARENT,
  stepIndicatorLabelUnFinishedColor: COLORS.TRANSPARENT,
  labelColor: COLORS.BLACK_31,
  labelSize: 12,
  currentStepLabelColor: COLORS.BLACK_31,
  separatorStrokeUnfinishedWidth: 0,
  separatorStrokeFinishedWidth: 0,
};

export {consultationStyles, requestResultStyles, styleStepIndicator};
