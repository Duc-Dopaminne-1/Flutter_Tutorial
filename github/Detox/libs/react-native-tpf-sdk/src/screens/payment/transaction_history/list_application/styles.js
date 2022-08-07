import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { Shadow } from '../../../../constants/stylesCSS';
import { StyleSheet } from 'react-native';
import { scale } from '../../../../utils/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary,
    paddingHorizontal: SPACING.Medium,
    paddingVertical: SPACING.Large
  },
  content: {
    paddingVertical: SPACING.Medium,
    backgroundColor: CUSTOM_COLOR.White,
    ...Shadow,
    borderRadius: BORDER_RADIUS
  },
  status: {
    paddingVertical: SPACING.XSmall,
    paddingHorizontal: SPACING.Normal,
    backgroundColor: CUSTOM_COLOR.PersianGreen,
    borderRadius: scale(4),
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.Medium,
    marginBottom: SPACING.Medium
  },
  statusTxt: {
    color: CUSTOM_COLOR.White,
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  amount: {
    color: CUSTOM_COLOR.BlueStone,
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.Medium,
    marginTop: SPACING.XNormal
  },
  normalTxt: {
    color: CUSTOM_COLOR.GreenBold,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  boldTxt: {},
  divider: {
    marginBottom: SPACING.Small
  },
  listApplicationText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginTop: SPACING.Large
  },
  icon: {
    width: scale(46),
    height: '100%',
    alignItems: 'center',
    marginRight: SPACING.XNormal
  },
  imageInvoice: {
    height: scale(46),
    width: scale(46)
  },
  applicationItem: {
    paddingTop: SPACING.Medium,
    paddingBottom: SPACING.XMedium,
    borderBottomColor: CUSTOM_COLOR.GreyDivider,
    borderBottomWidth: scale(1),
    height: scale(78),
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountApplication: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  noData: {
    textAlign: 'center',
    alignSelf: 'center',
    color: TEXT_COLOR.Gray,
    fontSize: FONT_SIZE.BodyText,
    marginTop: SPACING.Large,
    lineHeight: LINE_HEIGHT.BodyText
  }
});
