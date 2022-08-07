import { colors, WIDTH_RATIO, WIDTH, HEIGHT } from '@src/constants/vars';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    backgroundColor: colors.DARK_GREY,
    width: 100 * WIDTH_RATIO,
    height: 100 * WIDTH_RATIO,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOther: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    width: 100 * WIDTH_RATIO,
    height: 100 * WIDTH_RATIO,
  },
  imageOtherText: {
    fontSize: 26,
  },
  flatList: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});
