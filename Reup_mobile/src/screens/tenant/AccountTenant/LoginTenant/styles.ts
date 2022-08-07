import { WIDTH, HEIGHT, fonts } from '@constants/vars';
import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { isAndroid } from '@src/utils';
const topPadding = isAndroid() ? HEIGHT * 0.035 : HEIGHT <= 736 ? HEIGHT * 0.035 : HEIGHT * 0.05;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 30,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Theme.signin.bgContent,
    borderRadius: 1,
  },
  contentContainerStyle: {
    justifyContent: 'center',
    flexGrow: 1,
    paddingVertical: 35,
  },
  inputStyle: {
    fontSize: 14,
    margin: 5,
  },
  headerTitle: {
    fontSize: 20,
    marginTop: 10,
    color: Theme.signin.headerTitle,
    fontFamily: fonts.MontserratMedium,
  },
  logo: {
    width: WIDTH,
    height: HEIGHT,
    paddingVertical: topPadding,
  },
  logoReup: {
    width: 100,
    height: 50,
  },
  inputFormSubContainer: {
    width: '100%',
    marginTop: 12,
  },
  dontHaveAccountContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
  },
  titleSmall: {
    fontSize: 15,
    alignSelf: 'flex-start',
    color: Theme.signin.titleSmall,
    fontFamily: fonts.MontserratLight,
  },
  containerRememberAndForgot: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonTextLogin: {
    fontSize: 15,
  },
  buttonLogin: {
    marginTop: 25,
    backgroundColor: Theme.signin.buttonLogin,
  },
  haveAccountContainer: {
    width: '100%',
    marginTop: 25,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.signin.bgDivider,
  },
  dontHaveAccountText: {
    marginStart: 5,
    fontFamily: fonts.MontserratLight,
    fontSize: 15,
  },
  containerSocial: {
    marginTop: 25,
    width: '100%',
  },
  textSocial: {
    fontFamily: fonts.MontserratLight,
  },
  containerButtonSocial: {
    flexDirection: 'column',
    marginTop: 15,
    marginHorizontal: 40,
  },
  facebookButton: {
    width: '100%',
    height: 40,
  },
  googleButton: {
    width: '100%',
    height: 40,
    marginTop: 15,
  },
});

export default styles;
