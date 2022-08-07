import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, WIDTH } from '@src/constants/vars';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 11,
    marginVertical: 15,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: Theme.my_purchase_tenant.backgroundContent,
  },
  closeButton: {
    width: 30,
    height: 30,
  },
  closeImage: {
    width: 12,
    height: 20,
    marginRight: 8,
    marginTop: 8,
  },
  sellerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoSeller: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: Theme.my_purchase_tenant.backgroundContactButton,
    height: 25,
    width: WIDTH / 3,
    alignItems: 'flex-start',
  },
  contactText: {
    color: Theme.my_purchase_tenant.contactButtonText,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  iconContact: {
    width: 14,
    height: 14,
  },
  nameText: {
    color: Theme.my_purchase_tenant.sellerNameText,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
  },
  nameContainer: {
    justifyContent: 'flex-start',
  },
  apartmentCodeText: {
    color: Theme.my_purchase_tenant.apartmentCodeText,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  apartmentCodeContainer: {
    marginLeft: 15,
  },
  separator: {
    width: '100%',
    height: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.my_purchase_tenant.backgroundContent,
  },
  totalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 14,
  },
  totalText: {
    color: Theme.my_purchase_tenant.titleProductColor,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  priceText: {
    color: Theme.my_purchase_tenant.priceText,
    fontSize: 15,
    fontFamily: fonts.MontserratSemiBold,
  },
});
