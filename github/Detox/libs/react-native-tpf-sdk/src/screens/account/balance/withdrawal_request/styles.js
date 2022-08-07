import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { DEVICE_WIDTH, SPACING } from '../../../../constants/size';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  scrollView: {
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Large,
    paddingBottom: SPACING.HasBottomButton
  },
  desc: {
    fontSize: FONT_SIZE.SubHead,
    color: CUSTOM_COLOR.ShuttleGray,
    lineHeight: LINE_HEIGHT.SubHead
  },
  btnView: {
    padding: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    width: DEVICE_WIDTH
  }
});
