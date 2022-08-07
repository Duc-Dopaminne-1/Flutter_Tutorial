import { StyleSheet } from 'react-native';
import { Theme } from '../Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  containerRadiusBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  customRadioBtn: {
    height: 18,
    width: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Theme.radio_button.normalBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginStart: 11,
    flex: 1,
    alignItems: 'flex-start',
  },
  labelRadioButton: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.radio_button.title,
  },
  activeCustomRadioBtn: {
    borderColor: Theme.radio_button.borderColorCustomRadioBtn,
  },
  activeRadioBtn: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Theme.radio_button.backgroundColorActiveRadioBtn,
  },
  radioButtonView: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default styles;
