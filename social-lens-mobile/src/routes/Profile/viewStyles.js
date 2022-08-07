import { StyleSheet, Dimensions } from 'react-native';
import {colors, fonts} from "../../constants";

let dm = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  basicInfoContainer: {
    marginHorizontal: 50,
    alignSelf: 'stretch',
    marginVertical: 10
  },
  fullNameContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  fullNameBig: {
    fontFamily: fonts.family.HNMedium,
    fontSize: 24,
    letterSpacing: 2,
    color: colors.dark,
  },
  editBtn: {
    marginLeft: 10
  },
  powerBtn: {
    marginLeft: 15
  },
  briefContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  briefIcon: {
    width: 16,
    height: 16,
    marginHorizontal: 5
  },
  briefText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.text_light_grey,
    marginHorizontal: 5
  },
  briefDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.text_light_grey,
    marginHorizontal: 5
  },
  fullDivider: {
    marginHorizontal: -20,
    alignSelf: 'stretch',
    height: 3,
    backgroundColor: colors.light_gray
  },
  detailsContainer: {
    marginHorizontal: -20,
    marginBottom: -20,
    alignSelf: 'stretch',
    backgroundColor: colors.background_gray,
    padding: 20
  },
  socialmediaContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialmediaBtn: {
    marginHorizontal: 10
  },
  divider: {
    alignSelf: 'stretch',
  },
  fullNameSm: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNMedium,
    fontSize: 18,
    letterSpacing: 1,
    color: colors.dark,
    marginTop: 20,
    marginBottom: 10
  },
  summary: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNLight,
    fontSize: 14,
    color: colors.dark,
    marginBottom: 20
  },
  userInfoContainer: {
    alignSelf: 'stretch',
    marginVertical: 20
  },
  itemContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  icon: {
    width: 30,
    height: 30
  },
  iconDivider: {
    marginHorizontal: 5,
    height: 20,
    width: 1,
    backgroundColor: colors.picker_gray
  },
  label: {
    flex: 1,
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    color: colors.label_gray
  },
  info: {
    width: ( dm.width - 65 ) * 5 / 8,
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    color: colors.dark,
    paddingHorizontal: 10,
  },
  featuredVideoContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginVertical: 20
  },
  featured: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNLight,
    fontSize: 20,
    color: colors.black_grey,
    marginBottom: 10
  },
  videoContainer: {
    alignSelf: 'stretch',
    height: 200
  },
  video: {
    alignSelf: 'stretch',
    flex: 1
  },
  videoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.black03,
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoText: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNLight,
    fontSize: 14,
    color: 'red'
  }
});