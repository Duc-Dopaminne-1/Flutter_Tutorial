import { StyleSheet } from 'react-native';
import { colors, HEIGHT } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    height: HEIGHT * 0.2,
    aspectRatio: 1,
    borderRadius: (HEIGHT * 0.2) / 2,
    marginTop: HEIGHT * 0.12,
  },

  title: {
    marginTop: HEIGHT * 0.04,
    fontSize: 20,
    textAlign: 'center',
  },

  artist: {
    marginTop: 5,
    fontSize: 10,
    color: colors.TEXT_PLACEHOLDER,
    textAlign: 'center',
  },
});

export default styles;
