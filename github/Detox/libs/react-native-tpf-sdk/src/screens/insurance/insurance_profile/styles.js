import { scale } from '../../../utils/responsive';
import { StyleSheet } from 'react-native';
import { CUSTOM_COLOR } from '../../../constants/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { DEVICE_WIDTH, SPACING } from '../../../constants/size';

const styles = StyleSheet.create({
  additionalServiceProfilesWrapper: {
    flex: 1,
    backgroundColor: CUSTOM_COLOR.White
  },
  utilities: {
    marginTop: scale(27, false),
    paddingHorizontal: SPACING.Normal
  },
  createBtn: {
    bottom: scale(90),
    alignSelf: 'center',
    position: 'absolute',
    width: DEVICE_WIDTH * 0.8
  },
  createText: {
    fontSize: FONT_SIZE.Heading
  }
});

export default styles;
