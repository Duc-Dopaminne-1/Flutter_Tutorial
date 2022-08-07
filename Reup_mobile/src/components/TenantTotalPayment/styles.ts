
import { HEIGHT, WIDTH, colors, fonts } from '@constants/vars';
import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../Theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 180,
    justifyContent: 'space-between',
    backgroundColor: Theme.monthly_bill.totalBackgroundColor,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Theme.monthly_bill.textTotalDescription,
    fontSize: 15,
    fontFamily: fonts.MontserratRegular,
  },
  titleContainer: {
    marginTop: 30,
  },
  amountContainer: {
    marginTop: 22,
  },
  amount: {
    color: Theme.monthly_bill.totalTextColor,
    fontSize: 40,
    fontFamily: fonts.MontserratRegular,
  },

});

export default styles;
