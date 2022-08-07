import { StyleSheet } from 'react-native';
import { colors, fonts } from '@constants/vars';
import { Theme } from '@components/Theme';

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.BORDER_LINE,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  dateShape: {
    flex: 1,
    height: 30,
    justifyContent: 'center', alignItems: 'center'
  },
  firstDateShape: {
    width: 55,
    height: 30,
    justifyContent: 'center', alignItems: 'center'
  },
  dateText: {
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    color: Theme.calendar.textColorTitle
  },
  smallDateText: {
    fontSize: 8, lineHeight: 14,
    textAlignVertical: 'bottom',
    fontFamily: fonts.MontserratLight,
    color: Theme.calendar.textColorTitle
  },
  borderLine: {
    borderWidth: 1,
    borderColor: colors.GRAY,
  },
  grayBackground: {
    backgroundColor: colors.GRAY,
  },
  redBackground: {
    backgroundColor: Theme.calendar.greenBackground,
    borderColor: Theme.calendar.greenBackground
  },
  greenBackground: {
    backgroundColor: Theme.calendar.blueBackground,
    borderColor: Theme.calendar.blueBackground
  },
  veryLightPinkBackground: {
    backgroundColor: Theme.calendar.veryLightPinkBackground,
    borderColor: Theme.calendar.veryLightPinkBackground
  },
});

export default styles;
