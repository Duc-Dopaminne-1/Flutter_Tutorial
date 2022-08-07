import { StyleSheet } from 'react-native';
import { colors, BORDER_COLOR_DEFAULT, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  formBar: {
    backgroundColor: colors.INPUT_BG,
    height: 35,
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
  container: {
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  image: {
    width: 7,
    height: 14,
  },
  description: {
    fontSize: 13,
    marginBottom: 15,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
  },
});

export default styles;
