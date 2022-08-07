import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.XXNormal,
    backgroundColor: BACKGROUND_COLOR.White
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    color: TEXT_COLOR.ShuttleGray,
    lineHeight: LINE_HEIGHT.BodyText
  },
  name: {
    marginBottom: SPACING.Normal
  },
  money: {
    marginTop: SPACING.Medium
  }
});

export default styles;
