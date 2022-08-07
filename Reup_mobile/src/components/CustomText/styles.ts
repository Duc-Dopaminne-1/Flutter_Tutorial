import { StyleSheet } from 'react-native';
import { fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontFamily: fonts.MontserratLight,
    color: '#707070',
  },
  leftIcon: {
    width: 10,
    height: 10,
    tintColor: '#1B72BF',
    alignSelf: 'center',
    marginRight: 8,
  },
});

export default styles;
