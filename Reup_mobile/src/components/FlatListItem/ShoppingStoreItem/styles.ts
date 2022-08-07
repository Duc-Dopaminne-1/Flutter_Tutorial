import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, WIDTH } from '@src/constants/vars';

const marginItem = 15;

export const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Theme.productItemGrid.container,
    width: (WIDTH - marginItem * 3) / 2,
    marginVertical: 10,
    backgroundColor: Theme.shopping_store_tenant.backgroundContent,
    justifyContent: 'space-between',
  },
  viewContain: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    paddingHorizontal: 8,
    marginTop: 8,
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratLight,
    color: Theme.productItemGrid.title,
  },
  description: {
    paddingHorizontal: 8,
    marginTop: 3,
    fontSize: 11,
    textAlign: 'left',
    fontFamily: fonts.MontserratLight,
  },
  viewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  containerPrice: {
    alignItems: 'flex-start',
    width: '50%',
  },
  price: {
    textAlign: 'center',
    fontFamily: fonts.MontserratRegular,
    fontSize: 15,
    color: Theme.monthly_bill.textColorWater,
  },
  viewDetailButton: {
    backgroundColor: Theme.shopping_store_tenant.view_detail,
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 20,
    height: 25,
  },
  viewDetailText: {
    fontSize: 11,
    fontFamily: fonts.MontserratRegular,
    color: Theme.shopping_store_tenant.viewDetailButtonText,
  },
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    height: 20,
    width: 20,
  },
  status: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratMedium,
    alignSelf: 'flex-start',
  },
});
