import { StyleSheet } from 'react-native';
import { fonts, WIDTH, WIDTH_RATIO } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.staff.contentBackground,
    paddingLeft: 14,
    paddingTop: 17,
    paddingBottom: 16,
  },
  image: {
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
    paddingRight: 20,
    justifyContent: 'space-around',
  },
  name: {
    height: 25,
    color: Theme.staff.nameText,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    alignSelf: 'flex-start'
  },
  id: {
    textAlignVertical: 'bottom',
    height: 20,
    color: Theme.staff.idText,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    alignSelf: 'flex-start',
    width: WIDTH / 2 * WIDTH_RATIO,
  },
  status: {
    textAlignVertical: 'bottom',
    height: 20,
    color: Theme.staff.button,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    alignSelf: 'flex-end',
    textAlign: 'right',
    width: WIDTH / 5 * WIDTH_RATIO,
  },
});

export default styles;
