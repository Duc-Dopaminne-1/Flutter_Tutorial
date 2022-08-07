import { StyleSheet } from 'react-native';
import { fonts, colors, WIDTH } from '@src/constants/vars';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  webview: {
    fontSize: 12,
    fontFamily: fonts.AvenirLTStdRoman,
    color: colors.WHITE,
  },

  image: {
    width: WIDTH - 30,
    height: ((WIDTH - 30) * 2) / 3,
  },
});
