import { StyleSheet } from 'react-native';
import { WIDTH, fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    width: WIDTH / 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0
  },
  logo: {
    width: 56,
    height: 56
  }
});

export default styles;
