import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.staff_detail.background,
  },
  personalContainer: {
    paddingLeft: 24,
    paddingRight: 21,
    backgroundColor: Theme.staff_detail.blockBackground,
  },
  contactContainer: {},
  lineContainer: {
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Theme.staff_detail.lineContentBorder,
  },
  lastLineContainer: {
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
    borderColor: Theme.staff_detail.lineContentBorder,
  },
  lineTitle: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
  },
  content: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    maxWidth: 200,
    textAlign: 'right'
  },
  touchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  icon: {
    marginLeft: 8,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 10,
    backgroundColor: Theme.staff.contentBackground,
  },
  button: {
    width: '95%',
    backgroundColor: Theme.staff_detail.buttonDeleteBackground,
  },
  text: {
    color: Theme.staff_detail.buttonDeleteText
  }
});

export default styles;
