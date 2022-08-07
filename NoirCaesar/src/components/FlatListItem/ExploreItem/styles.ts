import { StyleSheet } from 'react-native';
import { WIDTH_RATIO } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 123 * WIDTH_RATIO,
    height: 173 * WIDTH_RATIO,
    marginRight: 15,
  },

  image: {
    flex: 1,
  },

  title: {
    position: 'absolute',
    bottom: 7,
    fontSize: 10,
  },

  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  touchable: {
    width: '100%',
    height: '100%',
  },
});

export default styles;
