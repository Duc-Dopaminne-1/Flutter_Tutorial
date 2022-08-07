import { colors, fonts } from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 15,
    marginBottom: 55,
  },

  inputStyle: {
    fontSize: 14,
    color: colors.TEXT_PLACEHOLDER,
    fontFamily: fonts.AvenirLTStdRoman,
  },

  inputContainer: {
    borderBottomWidth: 0,
  },

  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },

  button: {
    width: '100%',
    justifyContent: 'center',
    height: 52,
    borderRadius: 0,
  },
});

export default styles;
