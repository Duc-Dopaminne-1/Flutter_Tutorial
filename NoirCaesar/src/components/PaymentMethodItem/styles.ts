import { StyleSheet } from 'react-native';
import { colors, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    width: WIDTH * 0.9,
    height: 77,
    marginBottom: 15,
    paddingHorizontal: 18,
    borderColor: colors.GRAY_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  detailContainer: {
    marginLeft: 12,
    alignItems: 'flex-start',
  },

  title: {
    fontSize: 14,
  },

  radioButton: {
    width: 13,
    height: 13,
  },

  logoCreditCard: {
    width: 139,
    height: 11,
    marginTop: 10,
  },

  logoPaypal: {
    width: 64,
    height: 17,
  },
});

export default styles;
