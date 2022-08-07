import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../constants/colors';
import { scale } from '../../utils/responsive';

const styles = StyleSheet.create({
  highlightButtonWrapper: {
    borderRadius: 16,
    width: scale(108),
    alignItems: 'center',
    height: scale(33, false),
    justifyContent: 'center',
    backgroundColor: BACKGROUND_COLOR.Goblin
  },
  title: {
    color: TEXT_COLOR.Secondary,
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
  }
});

export default styles;
