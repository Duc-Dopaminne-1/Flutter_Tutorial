import { StyleSheet } from 'react-native';
import { SPACING_DEFAULT, FONT_COLOR, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },

  flatListLatestBlog: {
    paddingHorizontal: 15,
  },

  flatListBlog: {
    width: WIDTH,
    paddingHorizontal: 9,
  },

  mostPopular: {
    fontSize: 14,
    color: 'red',
    margin: 15,
  },
});

export default styles;
