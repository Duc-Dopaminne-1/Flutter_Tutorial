import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { StyleSheet, Platform } from 'react-native';
import { scale } from '../../../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: BACKGROUND_COLOR.Primary
    // backgroundColor: BACKGROUND_COLOR.Orange
  },
  wrapper: {
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  contentWrapper: {
    paddingBottom: SPACING.HasBottomButton
  },
  balanceItems: {
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    marginTop: SPACING.Normal
  },
  showDetail: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textView: {
    alignItems: 'center',
    marginTop: SPACING.Large
  },
  showDetailText: {
    // color: CUSTOM_COLOR.PersianGreen,
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  descText: {
    color: CUSTOM_COLOR.Tuna,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginBottom: SPACING.Normal
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: scale(8),
    borderRightWidth: scale(8),
    borderBottomWidth: scale(9),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginLeft: scale(162)
  },
  noticeView: {
    borderRadius: BORDER_RADIUS,
    padding: SPACING.XNormal,
    width: scale(205),
    height: scale(88),
    justifyContent: 'space-between'
  },
  notice: {
    color: CUSTOM_COLOR.White,
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  expectedTriangle: {
    marginLeft: scale(141)
  },
  expectedNoticeView: {
    height: scale(168)
  },
  availableBalanceModal: {
    marginTop: Platform.OS === 'ios' ? scale(125) : scale(93)
  },
  expectedBalanceModal: {
    marginTop: Platform.OS === 'ios' ? scale(238) : scale(225)
  }
});
