import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 7
  },
  productListContainer: {
    flex: 1
  },
  datePickerContainer: {
    height: 53
  },
  containerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 66,
    marginTop: 7
  },
  buttonAddNew: {
    width: '88%',
    height: 40,
  },
  buttonAddNewtext: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: 'white'
  },
});

export default styles;
