import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { Shadow } from '../../../../constants/stylesCSS';
import { StyleSheet } from 'react-native';
import { scale } from '../../../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  scrollView: {
    paddingTop: SPACING.Large
  },
  item: {
    marginBottom: SPACING.Medium,
    padding: SPACING.Medium,
    backgroundColor: CUSTOM_COLOR.White,
    borderRadius: BORDER_RADIUS,
    ...Shadow,
    marginHorizontal: SPACING.Medium
  },
  title: {
    fontSize: FONT_SIZE.Heading,
    color: CUSTOM_COLOR.BlueStone,
    lineHeight: LINE_HEIGHT.Heading,
    marginBottom: SPACING.Medium
  },
  rowContent: {
    paddingBottom: SPACING.Medium
  },
  lastContent: {
    paddingBottom: 0
  },
  text: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },

  btnView: {
    ...Shadow,
    padding: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    flexDirection: 'row'
  },
  cancelBtn: {
    flex: 1,
    marginRight: scale(15)
  },
  confirmBtn: {
    flex: 1
  }
});
