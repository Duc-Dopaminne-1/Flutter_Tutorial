import { WIDTH, colors, HEIGHT } from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },

  subContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  containerFormik: {
    flex: 1,
  },

  inputStyle: {
    width: WIDTH * 0.9,
  },

  inputStyleSmall: {
    width: WIDTH * 0.44,
  },

  iconInput: {
    width: 20,
    height: 20,
  },

  buttonCredit: {
    width: WIDTH * 0.8,
    marginVertical: 40,
  },

  buttonPayPal: {
    position: 'absolute',
    width: WIDTH * 0.8,
    bottom: 40,
  },

  billingAddressTitle: {
    fontSize: 14,
    color: colors.RED_COLOR,
  },

  billingAddressDetail: {
    fontSize: 12,
    marginLeft: 10,
  },

  billingAddressContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
  },

  billingAddressSubContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },

  checkBox: {
    width: 12,
    height: 12,
  },

  paypalInfoContainer: {
    marginTop: HEIGHT * 0.15,
    alignItems: 'center',
  },

  paypalInfo: {
    fontSize: 14,
    width: 283,
    textAlign: 'center',
  },

  paypalCard: {
    width: 162,
    height: 55,
    marginTop: 32,
  },
});

export default styles;
