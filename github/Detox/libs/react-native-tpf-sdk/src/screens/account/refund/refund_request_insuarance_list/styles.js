import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { Platform, StyleSheet } from 'react-native';
import { scale } from '../../../../utils/responsive';

export default StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  wrapper: {
    backgroundColor: CUSTOM_COLOR.White,
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: SPACING.Medium
  },
  noData: {
    textAlign: 'center',
    alignSelf: 'center',
    color: TEXT_COLOR.Gray,
    fontSize: FONT_SIZE.BodyText,
    marginTop: SPACING.Large,
    lineHeight: LINE_HEIGHT.BodyText
  },
  availableBalanceModal: {
    marginTop: Platform.OS === 'ios' ? scale(54) : scale(19),
    marginRight: scale(-6)
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: scale(8),
    borderRightWidth: scale(8),
    borderBottomWidth: scale(9),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: CUSTOM_COLOR.BlueStone,
    marginLeft: scale(254)
  },
  noticeView: {
    backgroundColor: CUSTOM_COLOR.BlueStone,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.XNormal,
    width: scale(280),
    height: scale(104),
    justifyContent: 'space-between'
  },
  notice: {
    color: CUSTOM_COLOR.White,
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  numberOfTransaction: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginTop: SPACING.Large,
    marginLeft: SPACING.Medium
  }
});
