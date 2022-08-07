import { Theme } from '@src/components/Theme';
import { StyleSheet } from 'react-native';
import { fonts } from '@constants/vars';

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
  },
  dropDownView: {
    marginTop: 7,
    paddingVertical: 11,
    backgroundColor: Theme.report.backgroundFilter,
  },
  viewDatePickers: {
    paddingTop: 16,
    flexDirection: 'row',
    backgroundColor: Theme.productList.viewDatePickers,
    justifyContent: 'space-between',
  },
  titleHeader: {
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
  buttonView: {
    paddingHorizontal: 20,
    width: undefined,
    alignSelf: 'flex-start',
    height: undefined,
    paddingVertical: 7,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: Theme.report.maintenance.backgroundModal,
  },
  wrapAReport: {
    marginTop: 7,
  },
});

export default styles;
