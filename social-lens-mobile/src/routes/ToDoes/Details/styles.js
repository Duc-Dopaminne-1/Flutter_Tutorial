import { StyleSheet } from 'react-native';
import {fonts ,colors } from "../../../constants";
import FastImage from "react-native-fast-image";
import React from "react";

export default StyleSheet.create({
  wrapper: {
    flex: 1
  },
  profile: {
    marginBottom: 10
  },
  wrapQuestion: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  container: {
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: colors.light_white_gray
  },
  content: {
    alignSelf: 'stretch'
  },
  header: {
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
  },
  questionItem: {
    alignSelf: 'stretch'
  },
  questionContainer: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  questionIconBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  questionIcon: {
    width: 30,
    height: 30,
  },
  questionInfo: {
    flex: 1,
    paddingHorizontal: 15
  },
  questionTitle: {
    fontSize: 24,
    color: colors.accent,
    letterSpacing: 1
  },
  questionText: {
    fontSize: 14,
    color: colors.dark,
    letterSpacing: 2,
    marginTop: 5
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addBtnRejected: {
    backgroundColor: colors.red
  },
  addIcon: {
    width: 20,
    height: 20
  },
  divider: {
    alignSelf: 'stretch',
    marginHorizontal: 15
  },
  btnGroup: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  btnSubmit: {
    width: 120,
    height: 40,
    backgroundColor: colors.light_blue,
  },
  btnText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 16,
    color: colors.white
  },
  bottombar: {
    height: 40,
    backgroundColor: colors.blue_grey,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottombarRejected: {
    backgroundColor: colors.red
  },
  bottombarDescription: {
    fontSize: 14,
    fontFamily: fonts.family.HNMedium,
    color: colors.white
  }
});