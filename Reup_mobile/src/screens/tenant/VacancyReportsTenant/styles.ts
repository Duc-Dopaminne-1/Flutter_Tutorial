import { Theme } from '@src/components/Theme';
import { StyleSheet } from 'react-native';
import { HEIGHT } from '@constants/vars';

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
    height: HEIGHT,
    backgroundColor: Theme.report.vacancy.background
  },
  wrapHeader: {
    paddingLeft: 8,
    backgroundColor: Theme.tenant_detail.contentBackground,
  },
  wrapChart: {
    paddingHorizontal: 14,
    backgroundColor: Theme.tenant_detail.contentBackground,
    paddingBottom: 22,
  },
});

export default styles;
