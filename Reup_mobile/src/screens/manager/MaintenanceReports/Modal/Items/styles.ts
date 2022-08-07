import { StyleSheet } from 'react-native';
import { colors, fonts } from '@constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  firstText: {
    flex: 1,
    alignItems: 'flex-start',
  },
  secondText: {
    flex: 1,
    alignItems: 'center',
  },
  threeText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  text: {
    color: colors.DARK_GRAY,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
});

export default styles;
