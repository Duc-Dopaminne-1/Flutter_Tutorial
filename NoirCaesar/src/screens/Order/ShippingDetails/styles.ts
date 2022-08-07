import { WIDTH, colors, fonts } from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },

  containerFormik: {
    paddingHorizontal: 20,
    flex: 1,
  },

  inputStyle: {
    marginBottom: 20,
  },

  phoneContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  phoneCountryCodeContainer: {
    backgroundColor: colors.INPUT_BG,
    width: WIDTH * 0.27,
    height: 52,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 6,
  },

  phoneInputStyle: {
    width: WIDTH * 0.59,
  },

  phoneInputTextStyle: {
    fontFamily: fonts.AvenirLTStdRoman,
    color: colors.TEXT_PLACEHOLDER,
    textAlign: 'center',
  },

  flagStyle: {
    width: 15,
    height: 10,
  },

  phonePickerContainer: {
    backgroundColor: '#292936',
    borderRadius: 10,
    maxHeight: 250,
    maxWidth: 301,
    overflow: 'hidden',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },

  buttonSubmit: {
    width: WIDTH * 0.8,
    marginVertical: 40,
  },
});

export default styles;
