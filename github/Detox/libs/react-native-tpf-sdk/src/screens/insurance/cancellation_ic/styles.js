import { scale } from '../../../utils/responsive';
import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';

const styles = StyleSheet.create({
  cancellationIcWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: scale(45, false),
    backgroundColor: CUSTOM_COLOR.White
  },
  cancelText: {
    color: TEXT_COLOR.Black,
    fontSize: FONT_SIZE.Heading,
    marginTop: scale(26, false),
    lineHeight: LINE_HEIGHT.TITLE
  }
});

export default styles;
