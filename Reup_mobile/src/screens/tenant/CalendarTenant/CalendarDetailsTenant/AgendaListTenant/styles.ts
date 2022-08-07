import { StyleSheet } from 'react-native';
import { fonts } from '@constants/vars';
import { Theme } from '@components/Theme';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: 15,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 5,
    backgroundColor: Theme.calendar.whiteBackground,
  },
  wrapDate: {
    marginHorizontal: 15,
    marginBottom: 8,
    marginTop: 13,
  },
  date: {
    fontSize: 13,
    fontFamily: fonts.MontserratSemiBold,
    color: Theme.calendar.textColorFilter,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  content: {
    fontSize: 11,
    fontFamily: fonts.MontserratSemiBold,
    color: Theme.calendar.whiteBackground,
    marginBottom: 15,
  },
  firstTextStyle: {
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    maxWidth: 250,
  },
  secondTextStyle: {
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    maxWidth: 125,
  },
  secondRightText: {
    marginLeft: 17,
    fontFamily: fonts.MontserratSemiBold,
    maxWidth: 125,
  },
  whiteText: {
    color: Theme.calendar.textColorWhite,
  },
  blackText: {
    color: Theme.calendar.textColorTitle,
  },
  blueBackground: {
    backgroundColor: Theme.calendar.blueBackground,
  },
  greenBackground: {
    backgroundColor: Theme.calendar.greenBackground,
  },
  veryLightPinkBackground: {
    backgroundColor: Theme.calendar.veryLightPinkBackground,
  },
  wrapHeader: {
    flexDirection: 'row',
  },
  nameText: {
    marginBottom: 11,
  },
  avatar: {
    height: 22,
    width: 22,
    borderRadius: 12,
    marginRight: 7,
  },
  name: {
    fontSize: 11,
    fontFamily: fonts.MontserratMedium,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: Theme.calendar.whiteBackground,
    marginVertical: 10,
  },
  wrapButton: {
    marginTop: 19,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  approve: {
    width: 68,
    height: undefined,
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: Theme.calendar.approveBackground,
    marginRight: 12,
  },
  textApprove: {
    fontFamily: fonts.MontserratLight,
    fontSize: 9,
    color: Theme.calendar.niceBlueTwo,
  },
  reject: {
    width: 68,
    height: undefined,
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: Theme.calendar.button_reject,
  },
  textReject: {
    fontFamily: fonts.MontserratLight,
    fontSize: 9,
    color: Theme.calendar.reject,
  },
  viewDay: {
    height: '100%',
    width: 60,
    marginLeft: 10,
  },
  textDayMonth: {
    fontFamily: fonts.MontserratLight,
    fontSize: 16,
    color: Theme.calendar.blueBackground,
  },
  textNameDay: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.calendar.brownishGrey,
  },
});

export default styles;
