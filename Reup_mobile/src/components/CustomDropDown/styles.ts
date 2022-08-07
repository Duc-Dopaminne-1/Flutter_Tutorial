import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowStyle: {
    width: 10,
    height: 4,
    marginLeft: 5,
  },
  comonComponentStyle: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },

  textStyle: {
    fontSize: 13,
    lineHeight: 20,
    color: 'white',
    fontFamily: fonts.MontserratMedium,
  },

  dropdownTextStyle: {
    fontSize: 13,
    lineHeight: 20,
    height: 40,
    color: '#292929',
    fontFamily: fonts.MontserratMedium,
  },

  dropDownItemStyle: {
    maxWidth: 150,
  },
});

export default styles;
