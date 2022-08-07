import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '../Theme';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    paddingRight: 21,
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 15
  },
  textView: {
    flex: 1,
  },
  leftText: {
    alignSelf: 'flex-start',
    fontSize: 13,
    color: Theme.product_detail.textColorLeft,
    fontFamily: fonts.MontserratMedium,
  },

  image: {
    width: 60,
    height: 45,
    paddingVertical: 15,
    marginRight: 8
  },
  bottomLine: {
    height: 1,
    width: '100%',
    backgroundColor: Theme.product_detail.backgroundColorBottomLine,
  },
});

export default styles;
