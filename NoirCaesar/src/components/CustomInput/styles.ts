import { StyleSheet } from 'react-native';
import { colors, BORDER_COLOR_DEFAULT, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  formBar: {
    backgroundColor: colors.INPUT_BG,
    height: 52,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6,
  },
  inputStyle: {
    fontSize: 14,
    fontFamily: fonts.AvenirLTStdRoman,
    color: colors.TEXT_PLACEHOLDER,
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
    fontSize: 12,
    marginBottom: 10,
  },
});

export default styles;
