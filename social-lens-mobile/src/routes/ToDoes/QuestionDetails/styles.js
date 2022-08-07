import { StyleSheet, Dimensions } from 'react-native';
import {fonts ,colors } from "../../../constants";

let dm = Dimensions.get('screen');

export default StyleSheet.create({
  wrapper: {
    flex: 1
  },
  profile: {
    marginBottom: 10
  },
  container: {
    alignSelf: 'stretch',
    flex: 1,
    paddingHorizontal: 20
  },
  text: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNMedium,
    fontSize: 20,
    color: colors.dark,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 20
  },
  wrapQuestion: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 20
  },
  textResult: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNMedium,
    fontSize: 17,
    color: colors.blue_grey,
    letterSpacing: 1,
    textAlign: 'left',
  },
  titleResult: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNMedium,
    fontSize: 17,
    color: colors.black_grey,
    letterSpacing: 1,
    textAlign: 'left',
    fontWeight: '900'
  },
  textOption: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNMedium,
    fontSize: 20,
    color: colors.dark,
    letterSpacing: 1,
    textAlign: 'left',
  },
  // question image or video
  qImage: {
    width: dm.width - 40,
    height: 200,
    backgroundColor: colors.medium_gray,
    marginBottom: 20
  },
  qVideoContainer: {
    width: dm.width - 40,
    height: 200,
    marginBottom: 20
  },
  qVideo: {
    alignSelf: 'stretch',
    height: 199
  },
  qVideoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: colors.dark_gray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qVideoPlayBtn: {
    fontSize: 50,
    color: colors.white
  },
  // question answers
  answerInput: {
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    height: 80,
    backgroundColor: '#efefef',
    borderWidth: 1,
    borderColor: colors.action_gray,
    fontFamily: fonts.family.HNMedium,
    fontSize: 14,
    color: colors.dark,
    letterSpacing: 1,
    padding: 10,
    marginBottom: 20,
  },
  list: {
    alignSelf: 'stretch',
    marginHorizontal: 10,
    marginVertical: 10
  },
  listItem: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: colors.light_grey
  },
  listItemSelected: {
    backgroundColor: colors.yellow_green
  },
  listItemText: {
    flex: 1,
    fontFamily: fonts.family.HNLight,
    fontSize: 20,
    letterSpacing: 1,
    color: colors.white
  },
  orderText: {
    marginLeft: 10,
    fontFamily: fonts.family.HNLight,
    fontSize: 20,
    letterSpacing: 1,
    color: colors.white
  },
  mediaAttachment: {
    alignSelf: 'stretch',
    marginVertical: 30,
    alignItems: 'center'
  },
  mediaUploadBtn: {
    width: 100,
    height: 40,
    backgroundColor: colors.medium_gray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mediaUploadIcon: {
    width: 50,
    height: 20
  },
  mediaList: {
    alignSelf: 'center',
    marginTop: 20
  },
  nomedia: {
    marginTop: 20,
    fontFamily: fonts.family.HNLight,
    fontSize: 20,
    letterSpacing: 1,
    color: colors.dark
  },
  mediaItem: {
    width: dm.width / 3,
    height: dm.width / 4,
    backgroundColor: colors.medium_gray,
    marginHorizontal: 10,
    marginVertical: 10
  },
  media: {
    alignSelf: 'stretch',
    flex: 1
  },
  mediaCloseBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mediaClose: {
    fontFamily: fonts.family.HNBold,
    fontSize: 20,
    color: colors.dark,
  },
  mediaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: colors.dark_gray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mediaPlayBtn: {
    fontSize: 30,
    color: colors.white
  },
  feedbackContainer: {
    marginVertical: 10
  },
  feedbackTitle: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNMedium,
    fontSize: 20,
    color: 'red',
    letterSpacing: 1,
    textAlign: 'center',
  },
  feedbackText: {
    alignSelf: 'stretch',
    textAlign: 'center',
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 10
  },
  btnGroup: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  btnSave: {
    width: 120,
    height: 40,
    backgroundColor: colors.light_blue,
    marginHorizontal: 10
  },
  btnBack: {
    width: 120,
    height: 40,
    backgroundColor: colors.medium_gray,
    marginHorizontal: 10
  },
  btnText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 16,
    color: colors.white
  }
});