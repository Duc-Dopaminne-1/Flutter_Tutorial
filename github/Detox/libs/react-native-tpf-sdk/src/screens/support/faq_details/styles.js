import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';
import { SPACING } from '../../../constants/size';

const styles = StyleSheet.create({
  financialProblemWrapper: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.White
  },
  listWrapper: {
    paddingTop: SPACING.Large,
    paddingBottom: SPACING.HtmlBottom
  },
  contentWrapper: {
    marginBottom: SPACING.Medium,
    paddingHorizontal: SPACING.Medium
  },
  titleWraper: {
    marginBottom: scale(12, false)
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  content: {
    paddingTop: SPACING.Medium
  },
  contentText: {
    color: TEXT_COLOR.GreenPea,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  }
});

export default styles;
