import { WIDTH, colors } from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 20,
    marginBottom: 100,
  },

  priceItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
  },

  priceText: {
    fontSize: 14,
  },

  totalText: {
    fontSize: 18,
    color: colors.RED_COLOR,
  },

  button: {
    position: 'absolute',
    width: WIDTH * 0.8,
    bottom: 40,
  },

  submitTouchable: {
    position: 'absolute',
    height: '100%',
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitContainer: {
    width: 60,
    height: 25,
    borderRadius: 25 / 2,
    justifyContent: 'center',
  },

  submitStyle: {
    fontSize: 12,
  },

  cartItem: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 20,
  },
});

export default styles;
