import { StyleSheet } from 'react-native';
import { WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: WIDTH * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  absoluteImage: {
    position: 'absolute',
    left: 65,
    right: 65,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default styles;
