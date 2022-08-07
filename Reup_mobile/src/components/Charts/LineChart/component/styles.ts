import { StyleSheet } from 'react-native';
import { colors, fonts } from '@constants/vars';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  wrapText: {
    height: 5,
    width: 30,
    borderRadius: 6,
  },
  text: {
    fontSize: 12,
    color: colors.BLACK,
    fontFamily: fonts.MontserratRegular,
  },
});
