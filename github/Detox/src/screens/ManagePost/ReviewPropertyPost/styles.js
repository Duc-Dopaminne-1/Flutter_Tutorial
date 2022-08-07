import {StyleSheet} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small, smallNormal, tiny} from '../../../assets/theme/metric';
import {getImageSize, IMAGE_RATIO, SCREEN_SIZE} from '../../../utils/ImageUtil';

// const aspectRatio = 16 / 9;
// const IMAGES_WIDTH = Dimensions.get('window').width;
// const IMAGES_HEIGHT = IMAGES_WIDTH / aspectRatio;
const FUll_IMAGE_SIZE = getImageSize(SCREEN_SIZE.WIDTH, IMAGE_RATIO.R16x9);

const styles = StyleSheet.create({
  textHeader: {
    ...METRICS.verticalMargin,
    ...FONTS.semiBold,
    fontSize: 13,
    color: COLORS.TEXT_DARK_10,
    alignSelf: 'center',
  },
  nameStyle: {
    fontSize: SIZES.FONT_14,
    ...FONTS.bold,
    ...METRICS.smallMarginBottom,
  },
  statusView: {
    backgroundColor: COLORS.BOOKING_COMPLETED,
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
    borderRadius: SIZES.BORDER_RADIUS_20,
    // eslint-disable-next-line sonarjs/no-duplicate-string
    alignSelf: 'flex-start',
  },
  iconsView: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: small,
    bottom: 24,
    left: 32,
  },
  textProject: {
    marginBottom: 8,
    ...FONTS.semiBold,
    fontSize: 21,
    color: COLORS.TEXT_DARK_10,
  },
  rejectedReasonTextContainer: {
    backgroundColor: COLORS.PINK_E4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textUpdatingReason: {
    ...FONTS.semiBold,
    fontSize: 12,
    color: COLORS.REQUEST_UPDATE_COLOR,
    textAlign: 'left',
    marginBottom: normal,
  },
  textRejectedReason: {
    ...FONTS.semiBold,
    fontSize: 12,
    color: COLORS.BLACK_31,
    textAlign: 'left',
  },
  textAddress: {
    ...HELPERS.fill,
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.TEXT_DARK_40,
  },
  textCommission: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.NEUTRAL_WHITE,
  },
  cell: {
    ...HELPERS.fill,
  },
  cellLabel: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.TEXT_DARK_40,
  },
  cellValue: {
    ...FONTS.semiBold,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_DARK_10,
  },
  textBlack14: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_33,
  },
  cellFlex2: {
    flex: 2,
  },
  cellFlex3: {
    flex: 3,
  },
  cellHorizontal: {
    ...HELPERS.row,
    alignItems: 'center',
    ...HELPERS.mainSpaceBetween,
    marginTop: normal,
  },
  cellLabelHorizontal: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.GRAY_A3,
    flex: 1,
  },
  cellValueContainer: {
    ...HELPERS.row,
    justifyContent: 'flex-end',
    flex: 2,
  },
  cellValueHorizontal: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.BLACK_31,
    textAlign: 'right',
  },
  cellValueHorizontalProjectView: {
    flex: 2,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellValueHorizontalProject: isActive => ({
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: isActive ? COLORS.PRIMARY_A100 : COLORS.TEXT_DARK_10,
    textDecorationLine: 'none',
    textAlign: 'right',
    alignSelf: 'center',
    marginRight: isActive ? SIZES.MARGIN_8 : 0,
  }),
  textShare: {
    ...FONTS.semiBold,
    fontSize: 13,
    color: COLORS.BLACK_33,
    marginStart: small,
  },
  imageCountContainer: {
    flexDirection: 'row',
    ...HELPERS.center,
    backgroundColor: COLORS.BLACK_33_OPACITY,
    borderRadius: 5,
    paddingHorizontal: small,
    paddingVertical: tiny,
  },
  imageWithTextContainer: {
    ...HELPERS.row,
    ...HELPERS.center,
    marginStart: 32,
  },
  followStatusViewContainer: {
    marginStart: normal,
    marginBottom: normal,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 999,
  },
  followButton: {
    ...HELPERS.row,
    ...HELPERS.center,
    paddingHorizontal: small,
    borderRadius: 5,
    backgroundColor: COLORS.FOLLOWING_STATUS_BG,
  },
  followStatusText: {
    ...FONTS.regular,
    fontSize: 10,
    color: COLORS.TEXT_DARK_10,
    paddingTop: small,
    paddingBottom: small,
    marginEnd: small,
  },
  followCountText: {
    ...FONTS.regular,
    fontSize: 10,
    color: COLORS.NEUTRAL_WHITE,
    marginTop: small,
  },
  propertyImage: {
    height: FUll_IMAGE_SIZE.HEIGHT,
    width: FUll_IMAGE_SIZE.WIDTH,
    position: 'relative',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  rowContainer: {
    ...HELPERS.row,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 4,
  },
  rowContainerWithBorder: {
    ...HELPERS.row,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_LINE,
  },
  dateContainer: {
    ...HELPERS.row,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 4,
    marginBottom: 16,
  },
  dateCell: {
    paddingEnd: 0,
  },
  textWithImageContainer: {
    ...HELPERS.row,
    ...HELPERS.center,
    marginEnd: normal,
  },
  title: {
    ...FONTS.semiBold,
    fontSize: SIZES.FONT_20,
    marginBottom: small,
  },
  textSection: {
    ...FONTS.semiBold,
    fontSize: 16,
    marginBottom: small,
  },
  textSectionTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.FONT_20,
    marginBottom: normal,
  },
  viewSection: {
    marginTop: 16,
  },
  viewMap: {
    height: FUll_IMAGE_SIZE.HEIGHT,
  },
  viewNearFacility: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 5,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  successPopupStyle: {
    padding: 0,
    margin: 0,
  },
  buttonReportText: {
    ...FONTS.regular,
    color: COLORS.GREY_CB,
  },
  buttonReport: {
    marginTop: normal,
  },
  reportPopup: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  shareIcon: {
    position: 'absolute',
    top: 25,
    right: 25,
  },
  iconContactView: {
    width: 21,
    height: 21,
    ...HELPERS.center,
  },
  loansContainer: {paddingHorizontal: 0},
  sliderContainer: {
    ...METRICS.smallVerticalPadding,
    ...HELPERS.rowCenter,
  },
  iconDropdown: {
    height: '100%',
    width: 20,
  },
  postDescription: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    opacity: 0,
    position: 'absolute',
  },
  commissionRowContainer: {
    height: 44,
    width: 44,
    alignSelf: 'center',
    ...HELPERS.center,
    borderRadius: 22,
  },
  commissionRow1BackgroundColor: {
    backgroundColor: COLORS.PRIMARY_A20,
  },
  commissionRow2BackgroundColor: {
    backgroundColor: COLORS.GREEN_E4,
  },
  iconCommissionRow: {
    padding: 12,
    width: 20,
    height: 20,
  },
  propertyGeneralInfoContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    ...METRICS.horizontalPadding,
    paddingVertical: 12,
  },
  imageBottomInfoContainer: {
    position: 'absolute',
    bottom: smallNormal,
    left: normal,
    right: normal,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageIcons: {
    width: 16,
    height: 16,
    tintColor: COLORS.NEUTRAL_WHITE,
  },
  utilitiesIcons: {
    width: 24,
    height: 24,
    tintColor: COLORS.NEUTRAL_WHITE,
  },
  iconStatus: {
    width: 16,
    height: 16,
  },
  // StatusTag styles
  statusText: {
    fontSize: 12,
    ...FONTS.regular,
  },
  statusContainer: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    zIndex: 99,
  },
  statusForRentContainer: {
    backgroundColor: COLORS.PRIMARY_B100,
  },
  statusForRentText: {
    color: COLORS.NEUTRAL_WHITE,
  },
  rentedContainer: {
    backgroundColor: COLORS.GREEN_EE,
  },
  rentedText: {
    color: COLORS.GREEN_60,
  },
  statusForSaleContainer: {
    backgroundColor: COLORS.GRAY_ED,
  },
  statusPropertyServiceTypeContainer: {
    backgroundColor: COLORS.GREEN_EB,
  },
  statusPropertyServiceTypeText: {
    color: COLORS.GREEN_BASIC,
  },

  propertyFacilityInfoContainer: {
    ...METRICS.resetMargin,
    justifyContent: 'flex-start',
  },
  projectInfoCellIconRight: {
    width: 16,
    height: 16,
    marginHorizontal: SIZES.MARGIN_8,
    tintColor: COLORS.PRIMARY_A100,
  },
  showMoreBtn: {
    width: 150,
    paddingVertical: normal,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showMoreText: {
    alignSelf: 'center',
    marginBottom: 0,
    marginRight: small,
    color: COLORS.PRIMARY_A100,
  },
  iconArrowDown: {
    width: 18,
    height: 9,
  },
  sectionContainer: {
    ...METRICS.smallMarginTop,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },

  // Document view
  contractDocumentText: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    textDecorationLine: 'underline',
    color: COLORS.PRIMARY_A100,
  },
  iconDocument: {
    width: 16,
    height: 16,
  },

  // Rating View
  ratingImageInnerContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingImageContainer: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
  },
  ratingContent: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.BLACK_31,
  },
  ratingAvatar: {
    width: 50,
    height: 50,
    borderRadius: SIZES.BORDER_RADIUS_50,
  },
  ratingVisitedDateText: {
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.GRAY_A3,
  },
  ratingShowMoreText: {
    alignSelf: 'center',
    ...FONTS.bold,
    fontSize: SIZES.FONT_14,
    color: COLORS.PRIMARY_A100,
  },

  // Separator line
  separatorLine: {
    borderTopWidth: 1,
    borderTopColor: COLORS.SEPARATOR_LINE,
  },
  verticalSeparatorLine: {
    borderLeftWidth: 1,
    height: 32,
    borderColor: COLORS.GREY_F0,
    alignSelf: 'center',
  },

  containerGray: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_100,
    ...HELPERS.rowCenter,
  },
  copyIcon: {width: 16, height: 16},
  commissionStatusIcon: {
    width: 16,
    height: 16,
  },
  statusTagContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.BORDER_RADIUS_100,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  statusTag: {
    ...FONTS.bold,
    ...FONTS.fontSize16,
    color: COLORS.BLACK_31,
  },
});

export const htmlStyles = StyleSheet.create({});

export default styles;
