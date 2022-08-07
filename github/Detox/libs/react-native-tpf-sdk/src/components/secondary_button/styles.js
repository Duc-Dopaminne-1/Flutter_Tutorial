import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { BUTTON_COLOR, TEXT_COLOR } from '../../constants/colors';
import { BORDER_RADIUS, BUTTON_HEIGHT } from '../../constants/size';

const styles = StyleSheet.create({
  button: {
    backgroundColor: BUTTON_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: BUTTON_HEIGHT
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    color: TEXT_COLOR.textBlack,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.BodyText
  },
  disabledText: {
    color: TEXT_COLOR.PrimaryDisable
  },
  disabled: {
    backgroundColor: BUTTON_COLOR.DisablePrimary
  },
  iconRight: {
    right: 0,
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default styles;
