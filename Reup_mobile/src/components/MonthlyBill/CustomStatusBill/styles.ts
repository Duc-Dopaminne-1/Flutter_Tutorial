import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  paid: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.monthly_bill.textColorPaid,
  },
  containerPaid: {
    width: '100%',
    height: 25,
    backgroundColor: Theme.monthly_bill.backgroundColorPaid,
    borderRadius: 2,
  },
  pending: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.monthly_bill.textColorPending,
  },
  containerPending: {
    width: '100%',
    height: 25,
    backgroundColor: Theme.monthly_bill.backgroundColorPending,
    borderRadius: 2,
  },
  draft: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.monthly_bill.textColorDraft,
  },
  containerDraft: {
    width: '100%',
    height: 25,
    backgroundColor: Theme.monthly_bill.backgroundColorDraft,
    borderRadius: 2,
  },
});

export default styles;
