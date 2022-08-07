import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  topContainer: {
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  wrapper: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    marginTop: SPACING.Normal,
    paddingBottom: SPACING.Large,
    borderRadius: BORDER_RADIUS
  },
  scrollContainer: {
    flex: 1
  },
  productName: {
    marginVertical: SPACING.XXNormal,
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    textAlign: 'center'
  },
  bankComparison: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.Medium
  },
  container11: {
    paddingBottom: scale(100)
  }
});
