import { StyleSheet } from 'react-native';
import { fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontFamily: fonts.AvenirLTStdRoman,
    color: colors.WHITE,
  },
});

export default styles;
