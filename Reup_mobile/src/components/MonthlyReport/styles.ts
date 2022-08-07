import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '../Theme';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 36,
    backgroundColor: Theme.monthly_report.backgroundColor,
  },
  totalContainer: {
    alignItems: 'center',
  },
  totalNumber: {
    color: Theme.monthly_report.proceedsColor,
    fontSize: 47,
    fontFamily: fonts.MontserratLight,
  },
  title: {
    marginTop: 20,
    color: Theme.monthly_report.titleColor,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  dropdownContainer: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
    flex: 1
  },
  dropdownDisplayText: {
    color: Theme.monthly_report.monthColor,
    fontFamily: fonts.MontserratLight,
    fontSize: 21,
  },
  dropdownText: {
    color: Theme.monthly_report.monthSelectColor,
    fontFamily: fonts.MontserratLight,
    fontSize: 21,
    lineHeight: 20,
  },
  dropdownItem: {
    maxHeight: 200,
  },
  arrowStyle: {
    tintColor: Theme.monthly_report.monthColor,
    width: 10,
    height: 4,
    marginLeft: 5,
  },
  line: {
    width: '100%',
    height: 1,
    marginTop: 26,
    backgroundColor: '#DBDBDB',
  },
  weeklyContainer: {
    marginTop: 22,
    marginBottom: 38,
  },
  weeklyTitle: {
    color: Theme.monthly_report.weeklyTitleColor,
    justifyContent: 'flex-start',
    width: '100%',
  },
  weekItem: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  weekTitle: {
    color: Theme.monthly_report.weekTitleColor,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  weekContentText: {
    fontSize: 13,
    fontFamily: fonts.MontserratSemiBold,
  },
});

export default styles;
