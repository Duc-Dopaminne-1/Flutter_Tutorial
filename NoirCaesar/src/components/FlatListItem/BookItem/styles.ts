import { StyleSheet } from 'react-native';
import { WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: (WIDTH - 51) / 3,
    height: ((WIDTH - 51) / 3) * 1.4,
    marginHorizontal: 6,
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
