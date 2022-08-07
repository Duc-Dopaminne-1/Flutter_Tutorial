import { StyleSheet } from 'react-native';
import { WIDTH, HEIGHT } from '@src/constants/vars';

const popupWidth = (WIDTH * 3) / 4;
const popupHeight = (HEIGHT * 2) / 3;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#292936',
    borderRadius: 10,
    paddingVertical: 15,
    width: popupWidth,
    height: popupHeight,
    overflow: 'hidden',
    alignSelf: 'center',
  },

  itemContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  country: {
    width: ((popupWidth - 30) * 3) / 5,
    fontSize: 16,
  },

  countryCode: {
    width: ((popupWidth - 30) * 2) / 5,
    textAlign: 'right',
    fontSize: 16,
  },
});
