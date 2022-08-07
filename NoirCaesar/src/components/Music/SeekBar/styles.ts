import { StyleSheet } from 'react-native';
import { HEIGHT } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: HEIGHT * 0.06,
  },

  sliderContainer: {
    flex: 3,
    marginHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  slider: {
    width: '100%',
  },

  track: {
    height: 4,
  },

  thumb: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 2,
  },

  gradient: {
    position: 'absolute',
    width: '98%',
    height: 4,
  },

  time: {
    fontSize: 14,
  },
});

export default styles;
