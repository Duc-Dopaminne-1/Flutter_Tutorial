import { StyleSheet } from 'react-native';
import { colors, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  swiper: {
    height: WIDTH * 0.7,
  },

  pagination: {
    bottom: 15,
    marginRight: 15,
    flex: 1,
    justifyContent: 'flex-end',
  },

  activeDot: {
    backgroundColor: 'white',
    width: 8,
    height: 8,
    borderRadius: 3.5,
    marginHorizontal: 3,
  },

  unactiveDot: {
    backgroundColor: colors.PRIMARY,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginHorizontal: 3,
    borderColor: 'white',
    borderWidth: 1,
  },

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
    width: WIDTH / 2,
  },
});

export default styles;
