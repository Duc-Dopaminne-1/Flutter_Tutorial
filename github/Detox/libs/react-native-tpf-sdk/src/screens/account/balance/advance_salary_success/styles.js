import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { DEVICE_WIDTH, SPACING } from '../../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary,
    alignItems: 'center',
    paddingTop: scale(35)
  },
  img: {
    marginBottom: SPACING.Large
  },
  text: {
    fontSize: FONT_SIZE.Heading,
    color: CUSTOM_COLOR.BlueStone,
    lineHeight: LINE_HEIGHT.Heading
  },
  btnView: {
    padding: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    position: 'absolute',
    bottom: 0,
    width: DEVICE_WIDTH
  }
});
