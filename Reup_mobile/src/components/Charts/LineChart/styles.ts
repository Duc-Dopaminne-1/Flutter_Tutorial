import { StyleSheet } from 'react-native';
import { fonts, WIDTH } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  sectionHeader: {
    marginTop: 7,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  chart: {
    marginLeft: -30,
  },
  wrapNote: {
    flexDirection: 'row',
  },
  headers: {
    height: 47,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Theme.report.maintenance.chart.headerBackground,
  },
  headersLeft: {
    flex: 1,
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginHorizontal: 7,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: fonts.MontserratSemiBold,
    color: Theme.report.maintenance.chart.title,
  },
  filter: {
    width: 84,
    height: 30,
    marginRight: 15,
    alignItems: 'center',
  },
  textFilter: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.MontserratLight,
  },
  line: {
    backgroundColor: Theme.report.maintenance.chart.line,
    width: WIDTH,
    height: 1,
  },
});
