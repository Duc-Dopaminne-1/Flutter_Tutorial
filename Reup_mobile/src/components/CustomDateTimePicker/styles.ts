import { StyleSheet } from 'react-native';
import { fonts } from '@constants/vars';
import { Theme } from '../Theme';
// styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  containers: {
    flex: 1,
    width: '100%',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Theme.customDateTimePicker.containers,
    backgroundColor: 'white',
  },
  description: {
    fontSize: 13,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
    marginBottom: 15,
    alignSelf: 'flex-start'
  },
  containerDatePicker: {
    flex: 1,
    height: 35,
    width: '100%',
    justifyContent: 'center',
  },
  dateInput: {
    borderWidth: 0,
  },
  dateIconStyle: {
    height: 20,
    width: 20,
    marginRight: 12,
  },
  dateTextStyle: {
    alignSelf: 'flex-start',
    marginStart: 20,
    fontSize: 11,
    color: Theme.customDateTimePicker.dateTextStyle,
    fontFamily: fonts.MontserratLight,
    lineHeight: 24,
  },
  btnTextConfirm: {
    color: '#1B72BF'
  }
});

export default styles;
