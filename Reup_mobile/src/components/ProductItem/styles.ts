import { StyleSheet } from 'react-native';
import { Theme } from '../Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 15
  },
  viewContain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  title: {
    marginLeft: 15,
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratMedium,
    color: 'black',
    lineHeight: 18,
    alignSelf: 'flex-start',
  },
  description: {
    marginLeft: 15,
    fontSize: 11,
    textAlign: 'left',
    fontFamily: fonts.MontserratMedium,
    lineHeight: 18,
    alignSelf: 'flex-start',
  },
  status: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratMedium,
    alignSelf: 'flex-start',
  },
  textView: {
    marginLeft: 0,
    marginRight: 10,
    flex: 1,
    alignSelf: 'center',
    color: Theme.productItem.textView,
  },
  moneyView: {
    marginTop: 8,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  price: {
    width: '100%',
    color: Theme.productItem.price,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Theme.signin.bgDivider
  },
});

export default styles;
