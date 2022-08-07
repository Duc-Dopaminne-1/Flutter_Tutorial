import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: Theme.monthly_report.backgroundColor,
  },
  containerElectricity: {
    flexDirection: 'row',
  },
  containerTextElectricity: {
    width: '75%',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  textElectricity: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.monthly_bill.textColorDraft,
  },
  iconElectricity: {
    width: 20,
    height: 20,
    tintColor: Theme.monthly_bill.textColorElectricity,
  },
  containerPriceElectricity: {
    alignSelf: 'center',
    width: '25%',
  },
  priceElectricity: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 15,
    color: Theme.monthly_bill.textColorElectricity,
  },
  containerWater: {
    flexDirection: 'row',
    marginTop: 15,
  },
  containerTextWater: {
    width: '75%',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  textWater: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.monthly_bill.textColorDraft,
  },
  iconWater: {
    width: 20,
    height: 20,
    tintColor: Theme.monthly_bill.textColorWater,
  },
  containerPriceWater: {
    alignSelf: 'center',
    width: '25%',
  },
  priceWater: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 15,
    color: Theme.monthly_bill.textColorWater,
  },
  containerTelecom: {
    flexDirection: 'row',
    marginTop: 15,
  },
  containerTextTelecom: {
    width: '75%',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  textTelecom: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.monthly_bill.textColorDraft,
  },
  iconTelecom: {
    width: 20,
    height: 20,
    tintColor: Theme.monthly_bill.textColorTelecom,
  },
  containerPriceTelecom: {
    alignSelf: 'center',
    width: '25%',
  },
  priceTelecom: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 15,
    color: Theme.monthly_bill.textColorTelecom,
  },
  containerService: {
    flexDirection: 'row',
    marginTop: 15,
  },
  containerTextService: {
    width: '75%',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  textService: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.monthly_bill.textColorDraft,
  },
  iconService: {
    width: 20,
    height: 20,
    tintColor: Theme.monthly_bill.textColorService,
  },
  containerPriceService: {
    alignSelf: 'center',
    width: '25%',
  },
  priceService: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 15,
    color: Theme.monthly_bill.textColorService,
  },
  containerGroupBtn: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15,
  },
  approve: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.monthly_bill.textColorApproveBtn,
  },
  containerApprove: {
    borderRadius: 2,
    width: '45%',
    height: 30,
    backgroundColor: Theme.monthly_bill.backgroundColorApproveBtn,
  },
  edit: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.monthly_bill.textColorEditBtn,
  },
  containerEdit: {
    borderRadius: 2,
    width: '45%',
    height: 30,
    backgroundColor: Theme.monthly_bill.backgroundColorEditBtn,
  },
  iconDelete: {
    width: '100%',
    height: '100%',
  },
  containerDelete: {
    borderRadius: 2,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkout: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.monthly_bill.textColorCheckoutBtn,
  },
  containerCheckout: {
    width: '100%',
    height: 30,
    backgroundColor: Theme.monthly_bill.backgroundColorCheckoutBtn,
    borderRadius: 2,
    marginTop: 15,
  },
  containerApproveEdit: {
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  containerDeleteBtn: {
    width: '25%',
  },
  containerTotal: {
    flexDirection: 'row',
    marginTop: 15,
  },
  containerTextTotal: {
    width: '75%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textTotal: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.monthly_bill.textColorDraft,
  },
  containerPriceTotal: {
    alignSelf: 'center',
    width: '25%',
  },
  priceTotal: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 15,
    color: Theme.monthly_bill.textColorDraft,
  },
});

export default styles;
