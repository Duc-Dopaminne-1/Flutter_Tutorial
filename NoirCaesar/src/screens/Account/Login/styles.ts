import { colors, WIDTH } from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    alignItems: 'center',
    flexDirection: 'column',
  },

  inputStyle: {
    fontSize: 14,
    margin: 5,
  },

  inputContainer: {
    marginHorizontal: 15,
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    height: 45,
    borderColor: 'grey',
    borderWidth: 1,
  },

  headerTitle: {
    fontSize: 18,
    marginTop: 28,
  },

  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: WIDTH * 0.9,
  },

  inputFormSubContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },

  dontHaveAccountContainer: {
    flexDirection: 'row',
    marginTop: 55,
  },

  forgotPasswordContainer: {
    flexDirection: 'row',
    marginTop: 31,
    marginBottom: 50,
  },

  titleSmall: {
    fontSize: 12,
  },

  titleSmallRed: {
    color: colors.TEXT_SMALL_RED,
    fontSize: 12,
  },
});

export default styles;
