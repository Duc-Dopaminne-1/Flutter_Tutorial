import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    height: 18,
    width: 18,
  },
  text: {
    color: colors.gray_700,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s14,
  },
});

export default styles;
