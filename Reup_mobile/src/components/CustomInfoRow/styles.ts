import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '../Theme';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    paddingRight: 21,
  },
  textContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
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
  rightText: {
    alignSelf: 'flex-end',
    fontSize: 13,
    color: Theme.product_detail.textColorRight,
    fontFamily: fonts.MontserratLight,
    textAlign: 'right'
  },
  rightIcon: {
    marginLeft: 10,
  },
  bottomLine: {
    height: 1,
    width: '100%',
    backgroundColor: Theme.product_detail.backgroundColorBottomLine,
  },
});

export default styles;
