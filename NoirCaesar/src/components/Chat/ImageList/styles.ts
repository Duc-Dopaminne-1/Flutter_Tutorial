import { colors, WIDTH_RATIO, WIDTH, HEIGHT } from '@src/constants/vars';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  singleImage: {
    backgroundColor: colors.DARK_GREY,
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});
