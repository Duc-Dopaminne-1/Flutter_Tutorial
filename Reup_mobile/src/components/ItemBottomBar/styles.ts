import { StyleSheet } from 'react-native';
import { WIDTH, fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: WIDTH / 5
  },
  logo: {
    width: 20,
    height: 20
  },
  text: {
    fontFamily: fonts.MontserratLight,
    fontSize: 10
  }
});

export default styles;
