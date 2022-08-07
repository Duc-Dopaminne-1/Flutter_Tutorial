import {StyleSheet} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal, small, tiny} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import {TAB_BUTTON_HEIGHT} from '../../components/NewTabBar';
import {getImageSize, IMAGE_RATIO, SCREEN_SIZE} from '../../utils/ImageUtil';

const IMAGE_WIDTH = SCREEN_SIZE.WIDTH - normal * 2;
const IMAGE_HEIGHT = getImageSize(IMAGE_WIDTH, IMAGE_RATIO.R16x9).HEIGHT;
const TAB_HEIGHT = IMAGE_HEIGHT + TAB_BUTTON_HEIGHT + normal;
const sectionImageWidth = SCREEN_SIZE.WIDTH - normal * 2;
const sectionImageHeight = getImageSize(sectionImageWidth, IMAGE_RATIO.R16x9).HEIGHT;
const COMMISSION_MAX_WIDTH = IMAGE_WIDTH / 2;
const styles = StyleSheet.create({
  imageCountContainer: {
    position: 'absolute',
    backgroundColor: COLORS.BLACK_33_OPACITY,
    bottom: normal,
    end: small,
    borderRadius: 5,
  },
  statusView: {
    backgroundColor: COLORS.RED_57,
  },
  imageCount: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'right',
    marginStart: normal,
    marginEnd: normal,
    marginTop: tiny,
    marginBottom: tiny,
  },
  iconsView: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: small,
    bottom: 12,
    left: 32,
  },
  iconView: {
    marginRight: 5,
    marginBottom: 5,
  },
  iconImage: {
    width: 32,
    aspectRatio: 1,
  },
  textProject: {
    ...FONTS.semiBold,
    fontSize: 20,
    color: COLORS.TEXT_DARK_10,
  },
  textAddress: {
    ...FONTS.regular,
    marginEnd: normal,
    fontSize: 16,
    color: COLORS.GRAY_A3,
    flex: 1,
  },
  iconFollow: {
    marginLeft: small,
    marginRight: small,
    position: 'absolute',
    right: 40,
    bottom: 20,
  },
  separator: {
    ...METRICS.smallVerticalMargin,
    height: 1,
    backgroundColor: COLORS.SEPARATOR_LINE,
  },
  textState: {
    fontSize: 14,
  },
  textStateValue: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.GREY_A7,
  },
  commissionContainer: {
    backgroundColor: COLORS.GREY_BERMUDA,
    borderRadius: normal,
    maxWidth: COMMISSION_MAX_WIDTH,
  },
  textCommission: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'right',
    marginStart: normal,
    marginEnd: normal,
    marginTop: tiny,
    marginBottom: tiny,
  },
  tableContainer: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    paddingBottom: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    borderColor: COLORS.SEPARATOR_LINE,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 4,
  },
  boderRight: {
    borderRightWidth: 1,
    borderRightColor: COLORS.SEPARATOR_LINE,
  },
  cellContainer: {
    marginTop: 16,
  },
  cellLabel: {
    color: COLORS.TEXT_DARK_10,
    ...FONTS.semiBold,
    fontSize: 14,
  },
  cellValue: {
    fontSize: 14,
    color: COLORS.BLACK_33,
  },
  textProjectSection: {
    ...FONTS.semiBold,
    color: COLORS.TEXT_DARK_10,
    fontSize: 20,
  },
  projectInfoTabStyle: {
    ...METRICS.verticalMargin,
    height: TAB_HEIGHT,
  },
  sectionImageStyle: {
    height: sectionImageHeight,
    width: sectionImageWidth,
    backgroundColor: COLORS.TEXT_DARK_40,
  },
  sceneContainer: {
    ...METRICS.horizontalMargin,
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
  },
  emptyTab: {
    ...HELPERS.center,
    ...METRICS.horizontalMargin,
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
    backgroundColor: COLORS.TEXT_DARK_40,
  },
  emptyTabText: {
    ...FONTS.regular,
    color: COLORS.NEUTRAL_WHITE,
  },
  buttonLeft: {
    ...commonStyles.buttonNext,
    paddingHorizontal: 25,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    marginEnd: normal,
  },
  buttonLeftWithoutMargin: {
    ...commonStyles.buttonNext,
    ...HELPERS.fill,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  buttonRight: {
    ...commonStyles.buttonNext,
    ...HELPERS.fill,
  },
  shareIcon: {
    position: 'absolute',
    top: 25,
    right: 25,
  },
  viewItems: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  separatorItems: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.SELECTED_AREA,
    marginHorizontal: 16,
  },
  infoStyle: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.LINE_COLOR,
    ...HELPERS.fillCenter,
  },
  viewInfo: {
    borderTopColor: COLORS.LINE_COLOR,
    borderBottomColor: COLORS.LINE_COLOR,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 16,
    paddingVertical: 8,
    ...HELPERS.rowCenter,
  },
  webview: {opacity: 0.99, flex: 1, minHeight: 200},
  viewRow: {
    ...HELPERS.rowSpaceBetween,
    ...HELPERS.crossCenter,
    marginTop: 8,
  },
  viewRowWithBorder: {
    ...HELPERS.rowSpaceBetweenCenter,
    marginTop: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.NEUTRAL_DIVIDER,
  },
  textBookingDescription: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_31,
    flex: 1,
  },
  textMaxBooking: {
    ...FONTS.bold,
    marginTop: small,
    fontSize: 14,
    color: COLORS.BLACK_31,
    flex: 1,
  },
  viewMap: {
    height: 210,
  },
  cellHorizontal: {
    ...HELPERS.row,
    alignItems: 'center',
    padding: normal,
    ...HELPERS.mainSpaceBetween,
    backgroundColor: COLORS.BACKGROUND,
  },
  cellValueHorizontalAddressView: {
    flex: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellValueHorizontalAddress: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.PRIMARY_A100,
    textDecorationLine: 'none',
    alignSelf: 'center',
    marginRight: 8,
  },
  addressIconRight: {
    width: 16,
    height: 16,
    marginHorizontal: SIZES.MARGIN_8,
  },
  investorContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  investorTitle: {
    fontSize: 16,
    ...FONTS.regular,
    color: COLORS.PRIMARY_A100,
    paddingLeft: 10,
  },
  investorDescription: {
    fontSize: 16,
    ...FONTS.regular,
  },
  investorLeft: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  investorRight: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    ...commonStyles.blackTextBold20,
    marginBottom: 16,
  },
  sectionContainer: {
    paddingVertical: 24,
  },
  projectSectionSeparator: {
    marginHorizontal: 16,
    borderTopColor: COLORS.NEUTRAL_DIVIDER,
    borderTopWidth: 1,
  },
  documentContainer: {
    paddingHorizontal: 8,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  separatorWhite: {
    height: 1,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  textProjectSectionDescription: {
    ...commonStyles.mainColorTextBold14,
  },
  projectSectionTitleContainer: {
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentListHeader: {
    backgroundColor: COLORS.BLUE_90,
    flexDirection: 'row',
    padding: 8,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  containerStatus: {position: 'relative', top: 0, left: 0},
  iconMap: {tintColor: COLORS.NEUTRAL_BLACK, width: 24, height: 24},
  followButton: {position: 'absolute', right: 20, top: 14},
});

export default styles;
