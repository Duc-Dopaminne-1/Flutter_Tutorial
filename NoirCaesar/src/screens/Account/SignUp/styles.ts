import { colors, fonts, WIDTH } from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.PRIMARY,
  },

  inputFormSubContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },

  inputContainer: {
    marginHorizontal: 15,
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    marginTop: 28,
    marginBottom: 20,
  },

  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: WIDTH * 0.9,
  },

  errorText: {
    color: 'red',
    left: 0,
  },

  buttonContainer: {
    marginVertical: 28,
  },

  buttonTitle: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  policyContainer: {
    flexDirection: 'row',
    marginHorizontal: 37,
    marginBottom: 15,
  },

  loginContainer: {
    flexDirection: 'row',
    marginBottom: 34,
  },

  titleSmall: {
    fontSize: 12,
  },

  titleSmallRed: {
    color: colors.TEXT_SMALL_RED,
    fontSize: 12,
  },

  titleTiny: {
    fontFamily: fonts.AvenirLTStdRoman,
    color: 'white',
    fontSize: 10,
  },

  titleTinyRed: {
    fontFamily: fonts.AvenirLTStdRoman,
    color: colors.TEXT_SMALL_RED,
    fontSize: 10,
  },
});

export default styles;
