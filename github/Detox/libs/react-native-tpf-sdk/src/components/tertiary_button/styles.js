import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../constants/colors';
import { BUTTON_HEIGHT_MEDIUM, DEVICE_WIDTH } from '../../constants/size';
import { scale } from '../../utils/responsive';

const styles = StyleSheet.create({
  tertiaryButtonWrapper: {
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: CUSTOM_COLOR.Orange,
    width: DEVICE_WIDTH * 0.35,
    height: BUTTON_HEIGHT_MEDIUM,
    backgroundColor: CUSTOM_COLOR.White,
    borderRadius: BUTTON_HEIGHT_MEDIUM / 2
  },
  title: {
    color: TEXT_COLOR.GreenLight,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  iconRight: {
    zIndex: 4,
    width: scale(20),
    right: scale(10),
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    height: scale(20, false)
  },
  disabled: {
    position: 'absolute',
    width: DEVICE_WIDTH * 0.35,
    height: BUTTON_HEIGHT_MEDIUM,
    borderColor: CUSTOM_COLOR.Orange,
    borderRadius: BUTTON_HEIGHT_MEDIUM / 2,
    backgroundColor: BACKGROUND_COLOR.AltoAlpha71
  },
  borderDisabled: {
    borderWidth: 0
  }
});

export default styles;
