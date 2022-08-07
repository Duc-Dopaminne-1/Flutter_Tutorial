import { HEIGHT, WIDTH, colors } from '@constants/vars';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT * 0.12,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: colors.SECONDARY,
    paddingBottom: 20,
    flexDirection: 'row',
  },

  subContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
  },

  darkLayout: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEIGHT * 0.12,
    backgroundColor: 'black',
    opacity: 0.3,
  },

  imageStyle: {
    width: 25,
    height: 25,
  },

  mainImageStyle: {
    position: 'absolute',
    bottom: 10,
    width: 50,
    height: 50,
  },

  titleStyle: {
    maxWidth: WIDTH * 0.7,
    fontSize: 18,
  },

  transparentView: {
    height: 25,
    width: 25,
    backgroundColor: 'transparent',
  },
});

export default styles;
