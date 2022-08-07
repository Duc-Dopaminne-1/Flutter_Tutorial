import { StyleSheet } from 'react-native';
import { colors, WIDTH, WIDTH_RATIO } from '@src/constants/vars';

export const imageWidth = 81 * WIDTH_RATIO;

const styles = StyleSheet.create({
  container: {
    width: WIDTH - 30,
    height: 110,
    flexDirection: 'row',
    marginVertical: 7.5,
    backgroundColor: colors.SECONDARY,
  },

  containerContent: {
    width: WIDTH - 30 - imageWidth,
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    overflow: 'hidden',
  },

  contentTitle: {
    fontSize: 14,
  },

  contentDes: {
    fontSize: 10,
    color: colors.GRAY_COLOR,
    marginBottom: 10,
  },

  title: {
    width: WIDTH - 60 - imageWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },

  coinContainer: {
    flexDirection: 'row',
  },

  iconCoins: {
    width: 16,
    height: 16,
    marginRight: 6,
  },

  textCoins: {
    fontSize: 14,
  },
});

export default styles;
