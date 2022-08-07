import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../../../constants/appFonts';
import { CUSTOM_COLOR } from '../../../../../../constants/colors';
import { SPACING } from '../../../../../../constants/size';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    // borderRadius: BORDER_RADIUS,
    // backgroundColor: BACKGROUND_COLOR.Primary,
    // paddingHorizontal: SPACING.Medium,
    // paddingBottom: SPACING.Large,
    // marginTop: SPACING.Large,
    // ...Shadow
  },
  itemView: {
    paddingTop: SPACING.Medium
  },
  itemTitle: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  itemValue: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  }
});
