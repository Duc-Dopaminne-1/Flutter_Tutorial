import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';
export const styles = StyleSheet.create({
  productContent: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 19,
  },
  titleText: {
    color: Theme.my_purchase_tenant.titleProductColor,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  titleContainer: {
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTextContainer: {
    justifyContent: 'flex-start',
  },
  priceText: {
    color: Theme.my_purchase_tenant.priceText,
    fontSize: 15,
    fontFamily: fonts.MontserratSemiBold,
  },
  dateText: {
    color: Theme.my_purchase_tenant.titleProductColor,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  dateContainer: {
    justifyContent: 'flex-end',
  },
});
