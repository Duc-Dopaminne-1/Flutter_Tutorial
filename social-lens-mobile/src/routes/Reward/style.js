import { StyleSheet } from 'react-native';
import {colors, fonts} from "../../constants";

export default StyleSheet.create({
  wrapper: {
    flex: 1
  },
  profile: {
    marginBottom: 10
  },
  container: {
    alignSelf: 'stretch',
    flex: 1
  },
  content: {
    alignSelf: 'stretch'
  },
  points: {
    marginBottom: 10,
    fontFamily: fonts.family.HNLight,
    fontSize: 20,
    letterSpacing: 1,
    color: colors.dark,
    alignSelf: 'center'
  },
  groupHeader: {
    alignSelf: 'stretch',
    height: 50,
    backgroundColor: colors.light_orange,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  icon: {
    width: 30,
    alignItems: 'center',
    marginRight: 10
  },
  title: {
    fontFamily: fonts.family.HNLight,
    fontSize: 20,
    letterSpacing: 1.5,
    color: colors.white
  },
  list: {
    alignSelf: 'stretch'
  },
  campaignContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderColor: colors.light_gray
  },
  logoContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    alignSelf: 'stretch',
    height: 150
  },
  nologo: {
    fontFamily: fonts.family.HNMedium,
    fontSize: 24,
    color: colors.dark
  },
  infoContainer: {
    flex: 2,
    height: 150,
    padding: 10,
    backgroundColor: colors.light_orange,
    flexDirection: 'row'
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  infoContent: {
    flex: 1,

  },
  infoTitle: {
    fontFamily: fonts.family.HNBold,
    fontSize: 14,
    color: colors.white,
    marginBottom: 5
  },
  infoDescriptionText: {
    fontFamily: fonts.family.HNBold,
    fontSize: 10,
    color: colors.white,
    marginBottom: 20
  },
  infoText: {
    fontFamily: fonts.family.HNBold,
    fontSize: 10,
    color: colors.white,
  },
  btnGroup: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 20
  },
  btnRedeem: {
    width: 120,
    height: 40,
    backgroundColor: colors.light_blue,
  },
  btnText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 16,
    color: colors.white,
  },
});
