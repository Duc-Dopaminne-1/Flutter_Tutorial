import { fonts, WIDTH, HEIGHT } from '@constants/vars';
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
    backgroundColor: Theme.signup.bgContent,
    borderRadius: 1,
  },

  contentContainerStyle: {
    justifyContent: 'center',
    flexGrow: 1,
    paddingVertical: 35,
  },

  inputFormSubContainer: {
    width: '100%',
    marginTop: 24,
  },
  inputContainer: {
    marginHorizontal: 15,
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 20,
    marginTop: 10,
    color: Theme.signup.headerTitle,
    fontFamily: fonts.MontserratMedium,
  },
  headerDescription: {
    fontSize: 13,
    marginTop: 6,
    color: Theme.signup.headerDescription,
    fontFamily: fonts.MontserratLight,
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

  errorText: {
    color: Theme.signup.errorText,
    left: 0,
  },

  buttonContainer: {
    marginTop: 10,
    backgroundColor: Theme.signup.buttonContainer,
  },

  buttonTitle: {
    fontSize: 15,
  },

  viewTitle: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 22,
  },

  title: {
    textAlign: 'left',
    fontSize: 13,
    fontFamily: fonts.MontserratRegular,
    lineHeight: 24,
    color: Theme.signup.title,
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
    fontSize: 15,
    color: Theme.signup.titleSmall,
    fontFamily: fonts.MontserratLight,
  },

  haveAccountContainer: {
    width: '100%',
    marginTop: 25,
  },

  divider: {
    height: 1,
    backgroundColor: Theme.signup.bgDivider,
  },

  haveAccountContent: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
  },

  haveAccountText: {
    fontSize: 15,
    marginStart: 5,
    color: Theme.signup.haveAccountText,
    fontFamily: fonts.MontserratLight,
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
    flex: 1,
  },
  googleButton: {
    flex: 1,
    marginTop: 15,
  },
});

export default styles;
