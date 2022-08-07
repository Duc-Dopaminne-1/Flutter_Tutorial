import { StyleSheet } from 'react-native';
import { fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontFamily: fonts.MontserratLight,
    color: '#707070',
  },
  textRequired: {
    fontSize: 8,
    color: '#1b72bf',
    alignSelf: 'flex-start',
    fontFamily: fonts.MontserratSemiBold,
    marginLeft: 4,
  },
});

export default styles;
