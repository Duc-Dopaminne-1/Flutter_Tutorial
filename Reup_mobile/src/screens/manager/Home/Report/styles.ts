import { Theme } from '@src/components/Theme';
import { StyleSheet } from 'react-native';
import { WIDTH, fonts } from '@constants/vars';

const dropDownPadding = 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lineChartContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Theme.report.backgroundFilter,
    paddingBottom: 20
  },
  monthlyReportContainer: {
    marginTop: 7,
  },
  dropDownView: {
    marginTop: 7,
    paddingVertical: 11,
    backgroundColor: Theme.report.backgroundFilter,
  },
  filter: {
    width: WIDTH - dropDownPadding * 2,
    height: 30,
    marginHorizontal: dropDownPadding
  },
  dropDownText: {
    flex: 1,
    color: Theme.filter_button.textColor,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
  }
});

export default styles;
