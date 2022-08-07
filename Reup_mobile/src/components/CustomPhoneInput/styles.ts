import { StyleSheet } from 'react-native';
import { colors, BORDER_COLOR_DEFAULT, fonts, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  containers: {
    alignItems: 'flex-start',
    width: '100%'
  },
  formBar: {
    backgroundColor: colors.INPUT_BG,
    height: 35,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 2,
    borderColor: 'rgba(219,219,219,0.8)',
    borderWidth: 1,
    width: '100%'
  },
  phoneView: {
    paddingStart: 5,
    flexDirection: 'row',
    height: 35,
    backgroundColor: '#F1F1F1'
  },
  callingCode: {
    marginHorizontal: 0,
    paddingLeft: 0,
    paddingRight: 6,
  },
  fakeInput: {
    height: '100%',
    alignItems: 'center',
    borderWidth: 0,
    paddingHorizontal: 0,
    marginLeft: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    width: '90%'
  },
  description: {
    fontSize: 13,
    marginBottom: 15,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
  },
  textStyle: {
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    color: '#333333',

  },
  flag: {
    width: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default styles;
