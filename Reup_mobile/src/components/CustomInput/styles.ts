import { StyleSheet } from 'react-native';
import { colors, BORDER_COLOR_DEFAULT, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  formBar: {
    backgroundColor: colors.INPUT_BG,
    height: 35,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 2,
    borderColor: 'rgba(219,219,219,0.8)',
    borderWidth: 1,
  },
  inputStyle: {
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    color: '#333333',
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
  wrapper: {
    alignItems: 'flex-start',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  image: {
    width: 18,
    height: 18,
  },
  description: {
    fontSize: 13,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
  },
  containerDescription: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconDescription: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default styles;
