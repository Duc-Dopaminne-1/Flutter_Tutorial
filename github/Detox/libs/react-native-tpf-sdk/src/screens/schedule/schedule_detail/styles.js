import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { BORDER_RADIUS, DEVICE_WIDTH, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  headerRight: {
    paddingHorizontal: SPACING.Medium,
    paddingVertical: scale(5)
  },
  headerRightText: {
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  group: {
    paddingVertical: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    ...Shadow
  },
  scrollView: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Large,
    paddingBottom: scale(100)
  },
  rowValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: SPACING.Medium,
    marginBottom: SPACING.Medium
  },
  state: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: scale(4)
  },
  stateTxt: {
    color: CUSTOM_COLOR.White,
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  scheduleDesc: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    color: CUSTOM_COLOR.BlueStone,
    flex: 1,
    marginRight: 5
  },
  customerName: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.GreenBold,
    textAlign: 'right',
    alignSelf: 'flex-start',
    width: '48%'
  },
  normalText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.GreenBold,
    alignItems: 'flex-start',
    width: '48%'
  },
  divider: {
    marginVertical: SPACING.Medium
  },
  value: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.GreenBold,
    marginTop: SPACING.Small
  },
  item: {
    marginTop: SPACING.XNormal
  },
  itemFirst: {
    marginTop: 0
  },
  break: {
    height: scale(16, false)
  },
  btnView: {
    padding: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: DEVICE_WIDTH
  },
  cancelBtn: {
    flex: 1,
    marginRight: scale(15)
  },
  confirmBtn: {
    flex: 1
  },
  ItemStyle: { paddingHorizontal: SPACING.Medium },
  outLine: {
    flex: 1
  }
});
