import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.building_system.backgroundColorSectionHeader
  },
  scrollContainer: {
    backgroundColor: Theme.home.backgroundColor,
  },
  lineChartContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 20
  },
  monthlyReportContainer: {
    marginTop: 7,
  },
  maintainenceContainer: {
    marginTop: 7,
  },
  newProductContainer: {
    marginTop: 7,
  },
  forLeaseContainer: {
    marginTop: 7,
  },
  headers: {
    height: 47,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default styles;
