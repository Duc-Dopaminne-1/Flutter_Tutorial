import { StyleSheet } from 'react-native';
import { Theme } from '../Theme';
import { fonts } from '@src/constants/vars';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flex: 1,
    width: '100%'
  },
  description: {
    fontSize: 13,
    marginBottom: 15,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
    alignSelf: 'flex-start',
  },
  dropdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentDropdownStyle: {
    borderColor: 'rgba(219,219,219,0.8)',
    borderWidth: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  arrowImage: {
    marginTop: 5,
    width: 9,
    height: 5,
    marginLeft: 7,
    tintColor: '#707070',
  },
  textStyle: {
    flex: 1,
    color: '#707070',
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
  },
});
