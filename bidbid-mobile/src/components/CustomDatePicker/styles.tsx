import { StyleSheet } from 'react-native';
import { colors, fonts, screenWidth } from '@/vars';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light_bg_beta,
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
    marginHorizontal: 0,
    width: '100%',
  },
  wrapModal: {
    margin: 0,
  },
  wrapDate: {
    minHeight: null,
    height: 42,
    width: screenWidth / 2 - 32.5,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.bg_gray,
    paddingHorizontal: 7,
  },
  wrapDateAndroid: {
    justifyContent: 'center',
    width: screenWidth / 2 - 32.5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.bg_gray,
    paddingVertical: 12,
    paddingHorizontal: 13,
  },
  datePicker: {
    height: 200,
    width: '100%',
    backgroundColor: colors.white,
  },
  infoTextPlaceholder: {
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s16,
    color: colors.gray_600,
    fontWeight: null,
    marginTop: 2,
  },
  infoText: {
    marginTop: 2,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontWeight: null,
  },
  wrapIcon: {
    width: null,
  },
  wrapBtn: {
    flex: null,
  },
  icon: {
    height: 19,
    width: 19,
  },
  confirmBtnText: {
    fontSize: fonts.size.s16,
    color: colors.back_button_ios_color,
  },
  cancelBtnText: {
    fontSize: fonts.size.s16,
    color: colors.gray_light_beta,
  },
  headerPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: -10,
  },
  timePicker: {
    height: 200,
    width: '100%',
    backgroundColor: colors.white,
  },
  fullDivider: {
    marginHorizontal: 0,
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: colors.white_alpha,
  },
  pickerIos: {
    height: 200,
    width: screenWidth,
    backgroundColor: colors.white,
  },
});
