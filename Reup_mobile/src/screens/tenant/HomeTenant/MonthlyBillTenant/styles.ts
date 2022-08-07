import { StyleSheet } from 'react-native';
import { WIDTH, fonts, HEIGHT } from '@constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: Theme.monthly_bill.backgroundColorSectionHeader,
    marginTop: 7,
  },
  scrollContainer: {},
  contentContainerScrollView: {},
  containerTotal: {
    backgroundColor: Theme.monthly_bill.backgroundColorSectionHeader,
    padding: 15,
  },
  detailContainer: {
    marginVertical: 30,
  },
  description: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: '#333333',
  },
  descriptionContainer: {
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  contentItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 15,
  },
  icons: {
    width: 20,
    height: 20,
  },
  textItem: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.monthly_bill.textColorDescription,
  },
  amount: {
    fontSize: 15,
    fontFamily: fonts.MontserratRegular,
  },
  electricAmount: {
    color: Theme.monthly_bill.textColorElectricity,
  },
  waterAmount: {
    color: Theme.monthly_bill.textColorWater,
  },
  telecomAmount: {
    color: Theme.monthly_bill.textColorTelecom,
  },
  serviceAmount: {
    color: Theme.monthly_bill.textColorService,
  },
  textItemContainer: {
    marginHorizontal: 14,
    flex: 1,
    alignItems: 'flex-start',
  },
  amountContainer: {
    width: 80,
    alignItems: 'flex-start',
  },
  lineContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
    backgroundColor: Theme.monthly_bill.backgroundColorSectionHeader,
  },
  line: {
    width: '100%',
  },
  contentContainerList: {
    flexGrow: 1,
  },
  stickyBar: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.monthly_bill.backgroundColorSectionHeader,
  },
  status: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 13,
    color: Theme.monthly_bill.textColorDraft,
  },
  containerStatus: {
    width: '25%',
    justifyContent: 'center',
  },
  apartmentCode: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 13,
    color: Theme.monthly_bill.textColorDraft,
  },
  containerApartmentCode: {
    width: '50%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  totalFee: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 13,
    color: Theme.monthly_bill.textColorDraft,
  },
  containerTotalFee: {
    width: '25%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  listBill: {
    maxHeight: HEIGHT * 0.5,
  },
});

export default styles;
