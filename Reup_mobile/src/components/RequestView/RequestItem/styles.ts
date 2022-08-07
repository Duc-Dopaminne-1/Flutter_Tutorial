import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 11,
    fontFamily: fonts.MontserratMedium,
  },
  number: {
    fontSize: 13,
    fontFamily: fonts.MontserratBold,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default styles;
