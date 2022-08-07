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
  inputItem: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 20
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
  resetBtn: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: colors.light_blue
  },
  reset: {
    fontFamily: fonts.family.HNLight,
    fontSize: 16,
    letterSpacing: 1,
    color: colors.white
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
  }
});
