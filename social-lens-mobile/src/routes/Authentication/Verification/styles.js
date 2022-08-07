import { StyleSheet } from 'react-native';
import {colors, fonts} from "../../../constants";

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 30
  },
  title: {
    marginHorizontal: 20,
    fontFamily: fonts.family.HNMedium,
    fontSize: 28,
    color: colors.dark,
    textAlign: 'center'
  },
  resendBtn: {
    marginTop: 20
  },
  resend: {
    fontFamily: fonts.family.HNLight,
    fontSize: 14,
    letterSpacing: 1,
    color: colors.dark,
    textDecorationLine: 'underline'
  },
  nextBtn: {
    marginTop: 50,
    marginBottom: 30,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: colors.light_blue
  },
  next: {
    fontFamily: fonts.family.HNLight,
    fontSize: 16,
    letterSpacing: 1,
    color: colors.white
  },
});