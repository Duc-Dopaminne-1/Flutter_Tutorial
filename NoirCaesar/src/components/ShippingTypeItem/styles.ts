import { StyleSheet } from 'react-native';
import { colors, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    width: WIDTH * 0.9,
    height: 128,
    paddingHorizontal: 18,
    marginBottom: 15,
    borderColor: colors.GRAY_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    marginLeft: 12,
  },

  radioButton: {
    width: 13,
    height: 13,
  },

  detailContainer: {
    marginTop: 10,
    marginLeft: 26,
    alignItems: 'flex-start',
  },

  description: {
    fontSize: 14,
    color: colors.GRAY_COLOR,
  },

  price: {
    fontSize: 16,
    color: colors.RED_COLOR,
    marginTop: 10,
  },
});

export default styles;
