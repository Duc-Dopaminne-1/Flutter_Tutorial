import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: Theme.monthly_bill.backgroundColorSectionHeader,
  },
  containerStatus: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  apartmentCode: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.monthly_bill_item.textColorApartmentCode,
  },
  containerApartmentCode: {
    width: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  time: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 13,
    color: Theme.monthly_bill.textColorDraft,
  },
  containerTime: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
