import { StyleSheet } from 'react-native';
import { fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  title: {
    fontFamily: fonts.MontserratLight,
    color: '#707070',
  },
  logo: {
    width: 25,
    height: 25,
    marginEnd: 10,
  },
});

export default styles;
