import { StyleSheet } from 'react-native';
import { fonts, colors, WIDTH } from '@src/constants/vars';
import { Theme } from '../Theme';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 13,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  containers: {
    flex: 1,
    width: '100%',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Theme.customDateTimePicker.containers,
    backgroundColor: 'white',
  },
  modal: {
    margin: 0,
    position: 'absolute',
    bottom: 0,
  },
  customBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  outerContainer: {
    backgroundColor: 'white',
    width: WIDTH,
  },
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    borderBottomWidth: 1,
    borderColor: '#EBECED',
  },
  toolBarButton: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  toolBarButtonText: {
    fontSize: 18,
    fontFamily: fonts.MontserratMedium,
  },
  btnTextConfirm: {
    color: '#1B72BF',
  },
  btnTextCancel: {
    color: '#333333',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  picker: {
    flex: 1,
  },
  itemStyle: {
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalDropdownText: {
    fontSize: 13,
    color: '#212B36',
    fontFamily: fonts.MontserratRegular,
  },
  iconRight: {
    tintColor: Theme.calendar.textColorFilter,
    width: 10,
    height: 4,
    marginLeft: 9,
  },
  containerGroupRadioButton: {
    paddingVertical: 0,
    flex: 1,
  },
  groupRadioButton: {
    marginBottom: 15,
  },
});

export default styles;
