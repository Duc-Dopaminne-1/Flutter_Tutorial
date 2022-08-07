import { StyleSheet } from 'react-native';
import { WIDTH, HEIGHT, colors, SPACING_DEFAULT } from '@src/constants/vars';

const topPadding = WIDTH === 375 ? HEIGHT * 0.02 : HEIGHT * 0.05;
const marginBottom = 52 + topPadding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatList: {
    paddingHorizontal: 9,
  },

  headerContainer: {
    paddingLeft: SPACING_DEFAULT,
    justifyContent: 'flex-start',
    paddingBottom: 15,
  },

  search: {
    borderRadius: 35 / 2,
    width: (WIDTH * 3) / 4,
    height: 35,
  },

  containerButtonSearch: {
    justifyContent: 'center',
  },

  iconNoItem: {
    width: 76,
    height: 76,
    alignSelf: 'center',
    marginBottom: 28,
  },

  titleNoItem: {
    fontSize: 18,
    color: colors.GRAY_COLOR,
    marginBottom: 14,
  },

  desNoItem: {
    fontSize: 14,
    color: colors.GRAY_COLOR,
  },

  containerItemSearch: {
    marginBottom: marginBottom,
  },

  containerNoItem: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default styles;
