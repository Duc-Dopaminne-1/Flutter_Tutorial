import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { HEADER_HEIGHT, MULTIE_BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Platform, StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';

const styles = StyleSheet.create({
  previewCreateQuestionWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: BACKGROUND_COLOR.Black
  },
  itemHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.XSmall
  },
  headerCamera: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_HEIGHT,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.Large,
    marginTop: Platform.OS === 'ios' ? scale(30, false) : 0
  },
  capture: {
    width: scale(128),
    height: scale(48, false),
    marginBottom: SPACING.XSmall,
    backgroundColor: BACKGROUND_COLOR.White,
    borderRadius: MULTIE_BORDER_RADIUS.X_LARGE
  },
  captureText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    height: scale(80, false),
    justifyContent: 'space-around'
  },
  image: {
    height: scale(410, false),
    width: '100%'
  }
});

export default styles;
