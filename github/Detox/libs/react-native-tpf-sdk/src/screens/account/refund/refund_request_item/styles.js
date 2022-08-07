import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { CUSTOM_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../../utils/responsive';

export default StyleSheet.create({
  container: {
    backgroundColor: CUSTOM_COLOR.White,
    paddingVertical: SPACING.Medium,
    borderBottomWidth: scale(1),
    borderBottomColor: CUSTOM_COLOR.GreyDivider
  },
  content: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.Fit
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  currency: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  itemName: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  icon: {
    marginRight: SPACING.XXNormal
  },
  date: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  }
});
