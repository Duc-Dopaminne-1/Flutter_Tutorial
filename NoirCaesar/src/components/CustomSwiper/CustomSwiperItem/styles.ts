import { StyleSheet } from 'react-native';
import { WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  contentContainer: {
    position: 'absolute',
    width: WIDTH - 30,
    left: 15,
    bottom: 15,
    alignItems: 'flex-start',
  },

  contentTitle: {
    fontSize: 18,
  },

  genresContainer: {
    flexDirection: 'row',
    width: WIDTH - 78,
    marginVertical: 8,
  },

  durationContainer: {
    width: 40,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    marginRight: 8,
  },

  duration: {
    fontSize: 8,
  },

  genres: {
    fontSize: 10,
  },

  description: {
    fontSize: 10,
    width: (WIDTH * 2) / 3,
  },
});

export default styles;
