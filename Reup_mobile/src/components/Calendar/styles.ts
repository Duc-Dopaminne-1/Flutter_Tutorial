import { StyleSheet } from 'react-native';
import { colors, fonts } from '@src/constants/vars';
import { Theme } from '@components/Theme';

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.BORDER_LINE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: colors.GRAY,
    height: 30,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.BORDER_LINE,
    height: 44,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  date: {
    width: 30,
    fontSize: 11,
    textAlign: 'center',
    fontFamily: fonts.MontserratLight,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: Theme.report.maintenance.backgroundModal,
  },
});

export default styles;
