import {Dimensions, StyleSheet} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {large, medium, METRICS, micro, normal, small, tiny} from '../../assets/theme/metric';
import {SCREEN_SIZE} from '../../utils/ImageUtil';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MARGIN = normal * 2;
const RATIO = 16 / 9;
const IMAGE_WIDTH = SCREEN_WIDTH - MARGIN;
const IMAGE_HEIGHT = IMAGE_WIDTH / RATIO;

export const AREA_COLUMN_COUNT = 2;
const RATIO_4x3 = 2.5;
const IMAGE_AREA_WIDTH = (SCREEN_WIDTH - 48) / AREA_COLUMN_COUNT;
const IMAGE_AREA_HEIGHT = IMAGE_AREA_WIDTH / RATIO_4x3;
const VIEW_IMAGE = IMAGE_AREA_HEIGHT - 24;

// const searchContainerPadding = Platform.OS === 'ios' ? normal : small;
const styles = StyleSheet.create({
  searchComponent: {
    flexDirection: 'row',
    margin: normal,
    height: 40,
  },
  searchContainer: {
    flex: 1,
    ...HELPERS.row,
    ...HELPERS.center,
    paddingHorizontal: small,
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  textSearch: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: small,
    ...FONTS.regular,
    marginTop: micro,
    color: COLORS.TEXT_DARK_40,
  },
  iconSearch: {
    width: 22,
    height: 22,
  },
  tabContainer: {
    ...HELPERS.center,
    marginEnd: normal,
  },
  textTab: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_10,
    fontSize: 14,
    marginBottom: small,
  },
  textTabSelected: {
    ...FONTS.regular,
    color: COLORS.PRIMARY_A100,
    fontSize: 14,
    marginBottom: small,
  },
  buttonGroup: {
    width: '100%',
  },
  button: {
    ...HELPERS.center,
  },
  buttonText: {
    ...FONTS.regular,
    marginTop: small,
    textAlign: 'center',
  },
  hotProjectContainer: {
    ...METRICS.horizontalMargin,
    ...METRICS.marginBottom,
    ...HELPERS.mainCenter,
    height: IMAGE_HEIGHT,
  },
  hotProjectImageContainer: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
    backgroundColor: COLORS.TEXT_DARK_40,
    borderRadius: 4,
    position: 'absolute',
  },
  hotProjectImage: {
    borderRadius: 4,
  },
  hotProjectTextfirst: {
    ...FONTS.regular,
    fontSize: 15,
    color: COLORS.NEUTRAL_WHITE,
  },
  hotProjectTextSecond: {
    ...FONTS.semiBold,
    fontSize: 20,
    color: COLORS.NEUTRAL_WHITE,
    marginTop: small,
    fontWeight: 'bold',
  },
  hotProjectBottomContainer: {
    ...HELPERS.fill,
    ...HELPERS.mainCenter,
    marginStart: small * 3,
    marginEnd: small * 3,
  },
  bookingButton: {
    backgroundColor: COLORS.PRIMARY_A100,
    width: '35%',
    borderRadius: 3,
    paddingTop: small,
    paddingBottom: small,
    marginTop: normal,
  },
  bookingButtonText: {
    ...FONTS.regular,
    fontSize: 13,
  },
  invitationContainer: {
    ...HELPERS.row,
    ...METRICS.smallVerticalPadding,
    ...METRICS.horizontalMargin,
    ...METRICS.marginBottom,
    backgroundColor: COLORS.BLUE_56,
    borderRadius: 4,
  },
  textInvitation: {
    ...FONTS.regular,
    fontSize: 11,
    color: COLORS.NEUTRAL_WHITE,
  },
  textInvitationPercent: {
    ...FONTS.semiBold,
    color: COLORS.NEUTRAL_WHITE,
    fontSize: 16,
  },
  invitaionButton: {
    color: COLORS.PRIMARY_A100,
    marginTop: small,
  },
  imageArea: {
    height: IMAGE_AREA_HEIGHT,
    width: IMAGE_AREA_WIDTH,
    marginStart: normal,
    marginTop: normal,
    borderRadius: 4,
  },
  imageAreaContainer: {
    height: IMAGE_AREA_HEIGHT,
    width: IMAGE_AREA_WIDTH,
    borderRadius: 4,
    position: 'absolute',
    backgroundColor: COLORS.TEXT_DARK_40,
  },
  areaTitle: {
    ...FONTS.semiBold,
    fontSize: 13,
    color: COLORS.NEUTRAL_WHITE,
  },
  areaDescription: {
    ...FONTS.regular,
    fontSize: 10,
    color: COLORS.NEUTRAL_WHITE,
  },
  noDataText: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
    alignSelf: 'center',
  },
  sectionText: {
    ...HELPERS.fill,
    ...FONTS.semiBold,
    color: COLORS.TEXT_DARK_10,
    fontSize: 24,
    marginBottom: normal,
  },
  subSectionText: {
    ...HELPERS.fill,
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.PRIMARY_B100,
  },

  viewMore: {
    ...FONTS.regular,
    fontSize: 11,
    color: COLORS.PRIMARY_A100,
    marginEnd: tiny,
  },
  listAreasContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  viewSignUpContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    height: 525,
    ...METRICS.marginTop,
    alignItems: 'center',
    padding: normal,
  },
  textContentSignUp: {lineHeight: 24, ...FONTS.regular},
  buttonSignUp: {
    marginTop: 16,
    marginBottom: 24,
  },
  styleButtonText: {
    ...FONTS.bold,
  },
  stepContainer: {
    width: '100%',
    height: 64,
    marginTop: 8,
  },
  stepTextView: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    height: large,
    marginLeft: 24,
    borderRadius: SIZES.BORDER_RADIUS_8,
    paddingVertical: 8,
    paddingHorizontal: medium,
    justifyContent: 'space-evenly',
  },
  viewIconStep: {
    top: small,
    width: medium + normal,
    height: 48,
    borderRadius: 24,
    position: 'absolute',
    ...HELPERS.center,
  },
  imageServices: {
    width: IMAGE_AREA_WIDTH,
    marginTop: normal,
    borderRadius: 4,
    padding: 12,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewIconServices: {
    backgroundColor: COLORS.PRIMARY_A20,
    width: VIEW_IMAGE,
    height: VIEW_IMAGE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  shadow: {
    shadowColor: COLORS.GRAY_BD,
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowOffset: {
      width: 1, // These can't both be 0
      height: 1, // i.e. the shadow has to be offset in some way
    },
    elevation: 1,
  },
  viewNameServices: {
    flex: 1,
    marginLeft: 12,
  },
  headerHome: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    ...HELPERS.center,
  },
  rowLogoHeader: {
    ...METRICS.horizontalMargin,
    ...HELPERS.rowStartCenter,
    ...HELPERS.mainSpaceBetween,
    marginRight: 0,
  },
  imageLogo: {
    width: 120,
  },
  viewSelectType: {
    width: 100,
    // width: '25%',
    paddingLeft: 12,
    ...HELPERS.rowCenter,
  },
  selectType: {
    borderColor: COLORS.TRANSPARENT,
  },
  iconDropdownFilter: {position: 'absolute', right: 14},
  lineSperator: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.SEPARATOR_LINE,
    marginRight: 20,
  },
  sectionIcons: {
    width: 25,
    height: 25,
  },

  pageNumberText: {
    ...FONTS.fontSize14,
    ...FONTS.regular,
    color: COLORS.PRIMARY_B100,
  },
  cardTextContainer: {
    flex: 1,
    ...HELPERS.row,
    ...METRICS.padding,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: 12,
    borderColor: COLORS.GREY_F0,
  },
  sectionContainer: {
    marginTop: 0,
    paddingVertical: 40,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  serviceItemLineContainer: {
    height: '100%',
    width: 32,
  },
  serviceItemLine: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.PRIMARY_A100,
  },
  serviceItemLineArrow: {
    width: 12,
    height: 12,
    tintColor: COLORS.PRIMARY_A100,
  },
  serviceItemLIneArrowContainer: {
    position: 'absolute',
    bottom: -6,
    left: -5,
  },
  sectionSeparator: {
    marginTop: 40,
  },
  blockPadding: {
    paddingTop: normal,
  },
  textContent: {...FONTS.regular, fontSize: 16, lineHeight: 22},
  imageIntro: {width: SCREEN_SIZE.WIDTH - 90, height: 430},
  imgSlogan: {alignSelf: 'center', marginTop: medium},
});

export default styles;
