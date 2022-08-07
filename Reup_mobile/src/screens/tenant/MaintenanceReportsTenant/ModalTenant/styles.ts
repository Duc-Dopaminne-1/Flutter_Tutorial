import { StyleSheet } from 'react-native';
import { fonts } from '@constants/vars';
import { Theme } from '@components/Theme';

const styles = StyleSheet.create({
  container: {
    height: '58%',
    backgroundColor: Theme.report.maintenance.modal.backgroundContainer,
  },
  wrapHeader: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: Theme.report.maintenance.modal.backgroundHeader,
    justifyContent: 'space-between',
  },
  titleHeader: {
    color: Theme.report.maintenance.modal.colorTitleHeader,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  flatlist: {
    backgroundColor: Theme.report.maintenance.modal.backgroundFlatlist,
  },
  wrapButton: {
    padding: 8,
    backgroundColor: Theme.report.maintenance.modal.backgroundWrapButton,
  },
  button: {
    height: undefined,
    paddingVertical: 12,
    backgroundColor: Theme.report.maintenance.modal.backgroundButton,
    alignSelf: 'flex-start',
  },
  textButton: {
    color: Theme.report.maintenance.modal.textButton,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
});

export default styles;
