import { StyleSheet } from 'react-native';
import {fonts ,colors } from "../../../constants";

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
  groupContainer: {
    alignSelf: 'stretch'
  },
  groupHeader: {
    alignSelf: 'stretch',
    height: 50,
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
    padding: 10
  },
  infoItem: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  infoText: {
    flex: 1,
    fontFamily: fonts.family.HNBold,
    fontSize: 10,
    color: colors.white
  },
  infoItemDescription: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginBottom: 5
  },
  infoDescriptionText: {
    flex: 1,
    fontFamily: fonts.family.HNBold,
    fontSize: 10,
    color: colors.white
  }
});