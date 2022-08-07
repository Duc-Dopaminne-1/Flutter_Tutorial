import { StyleSheet } from 'react-native';
import {colors, fonts} from "../../../constants";

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 30
  },
  title: {
    fontFamily: fonts.family.HNMedium,
    fontSize: 28,
    color: colors.dark,
    textAlign: 'center'
  },
  details: {
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    lineHeight: 15,
    color: colors.dark,
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 25
  },
  socialmediaContainer: {
    marginTop: 30
  },
  socialmedia: {
    marginBottom: 5
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginHorizontal: 30,
    marginVertical: 25,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: colors.input_gray,
  },
  orText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 15,
    color: colors.text_light_gray,
    marginHorizontal: 20
  },
  inputItem: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: colors.input_white,
    fontFamily: fonts.family.HNLight,
    fontSize: 16,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.input_gray,
    paddingHorizontal: 10
  },
  registerBtn: {
    marginTop: 20,
    paddingHorizontal: 10,
    marginBottom: 30,
    height: 40,
    backgroundColor: colors.light_blue
  },
  registerBtnDisabled: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: colors.gray
  },
  registerText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 16,
    letterSpacing: 1,
    color: colors.white
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  description: {
    fontFamily: fonts.family.HNLight,
    fontSize: 14,
    letterSpacing: 1,
    color: colors.input_gray,
  },
  here: {
    color: colors.primary_blue,
    textDecorationLine: 'underline'
  },
  // checkbox
  termsContainer: {
    marginHorizontal: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  checkIcon: {
    width: 16,
    height: 16,
    marginRight: 5
  },
  terms: {
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    color: colors.input_gray,
  },
});