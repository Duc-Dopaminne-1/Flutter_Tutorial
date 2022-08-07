import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    marginTop: 7,
    backgroundColor: Theme.new_monthly_bill.backgroundSectionHeader,
  },
  iconSectionHeader: {
    width: 15,
    height: 15,
    tintColor: Theme.new_monthly_bill.tintColorIconSectionHeader,
  },
  titleSectionHeader: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 13,
    color: Theme.new_monthly_bill.textColorTitleSectionHeader,
  },
  accessory: {
    height: 45,
  },
  listContainer: {
    flex: 1,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.new_monthly_bill.backgroundColorScrollView,
  },
  contentContainerScrollView: {
    padding: 15,
  },
  buttonContainer: {
    marginTop: 8,
    height: 80,
    backgroundColor: Theme.new_monthly_bill.backgroundColorContainerSubmitBtn,
  },
  button: {
    width: '88%',
    height: 40,
    marginTop: 13,
    backgroundColor: Theme.new_monthly_bill.backgroundColorSubmitBtn,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  monthlyFee: {
    width: '100%',
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.new_monthly_bill.textColorMonthlyFee,
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  containerInputElectricity: {
    marginTop: 15,
  },
  containerMonthYearPicker: {
    height: 35,
    justifyContent: 'space-between',
    alignContent: 'center',
    marginHorizontal: 15,
  },
  containerTextMonthYearPicker: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  textMonthYearPicker: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: Theme.new_monthly_bill.textColorMonthYearPicker,
  },
  iconMonthYearPicker: {
    width: 20,
    height: 20,
    tintColor: Theme.new_monthly_bill.tintColorMonthYearPicker,
  },
});

export default styles;
