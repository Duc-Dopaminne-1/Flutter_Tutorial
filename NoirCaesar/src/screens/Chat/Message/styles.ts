import { StyleSheet } from 'react-native';
import { WIDTH, HEIGHT, colors } from '@src/constants/vars';

const topPadding = WIDTH === 375 ? HEIGHT * 0.02 : HEIGHT * 0.05;
const bottomPadding = WIDTH === 375 ? 0 : WIDTH * 0.05;
const marginBottom = 52 + topPadding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  search: {
    borderRadius: 0,
    height: 55,
    backgroundColor: 'transparent',
  },

  containerChatList: {
    width: WIDTH,
    height: HEIGHT,
  },
  containerSearch: {
    width: WIDTH,
    height: 55,
    flexDirection: 'row',
    backgroundColor: '#676877',
    paddingStart: 15,
  },
  containerStyle: {
    paddingHorizontal: 8,
  },
  containerButtonSearch: {
    justifyContent: 'center',
  },

  iconNoItem: {
    width: 13,
    height: 13,
    alignSelf: 'center',
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
