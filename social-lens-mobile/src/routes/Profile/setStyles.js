import { StyleSheet, Dimensions } from 'react-native';
import {colors, fonts} from "../../constants";

let dm = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20
  },
  btnContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  saveBtn: {
    width: 120,
    height: 40,
    backgroundColor: colors.light_blue,
    alignSelf: 'flex-end'
  },
  btnText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 16,
    letterSpacing: 1,
    color: colors.white
  },
  cancelBtn: {
    width: 120,
    height: 40,
    backgroundColor: colors.gray,
    alignSelf: 'flex-start'
  },
  title: {
    fontFamily: fonts.family.HNMedium,
    fontSize: 14,
    color: colors.text_light_grey,
    textAlign: 'center',
    marginTop: 20
  },
  avatarContainer: {
    width: 120,
    height: 120,
    marginTop: 20
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  editBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  edit: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  basicInfoContainer: {
    marginHorizontal: 50,
    alignSelf: 'stretch',
    marginVertical: 20,
  },
  input: {
    height: 40,
    backgroundColor: colors.input_white,
    fontFamily: fonts.family.HNLight,
    fontSize: 14,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.input_gray,
    paddingHorizontal: 10,
    marginVertical: 5
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
    padding: 20,
    backgroundColor: colors.background_gray
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
  fullname: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNMedium,
    fontSize: 20,
    letterSpacing: 1,
    color: colors.dark,
    marginTop: 20,
    marginBottom: 10
  },
  summary: {
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    height: 100,
    backgroundColor: colors.input_white,
    fontFamily: fonts.family.HNLight,
    fontSize: 14,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.input_gray,
    paddingHorizontal: 10,
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
    color: colors.label_gray,
    marginRight: 5
  },
  infoInput: {
    width: ( dm.width - 65 ) * 5 / 8,
    height: 40,
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.input_gray,
    backgroundColor: colors.input_white,
    paddingHorizontal: 10,
  },
  infoTextContainer: {
    width: ( dm.width - 65 ) * 5 / 8,
    height: 40,
    borderWidth: 1,
    borderColor: colors.input_gray,
    backgroundColor: colors.input_white,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  infoTextPlaceholder: {
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    color: colors.text_gray
  },
  infoText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    color: colors.dark,
  },
  featuredVideoContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginVertical: 20
  },
  featuredVideoHeader: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  featured: {
    fontFamily: fonts.family.HNLight,
    fontSize: 20,
    color: colors.black_grey,
    marginRight: 10
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
  removeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 24,
    color: 'red',
    padding: 10
  }
});

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: ( dm.width - 65 ) * 5 / 8,
    height: 40,
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.input_gray,
    backgroundColor: colors.input_white,
    paddingHorizontal: 10,
  },
  inputAndroid: {
    width: ( dm.width - 65 ) * 5 / 8,
    height: 40,
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.input_gray,
    backgroundColor: colors.input_white,
    paddingHorizontal: 10,
  },
});

export const datePickerStyles = StyleSheet.create({
  datePicker: {
    width: ( dm.width - 65 ) * 5 / 8,
    height: 40,
    borderWidth: 1,
    borderColor: colors.input_gray,
    backgroundColor: colors.input_white
  },
  dateInput: {
    borderWidth: 0,
    paddingHorizontal: 10
  },
  dateText: {
    alignSelf: 'stretch',
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    color: colors.dark,
  },
  placeholderText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 12,
    alignSelf: 'stretch'
  }
});