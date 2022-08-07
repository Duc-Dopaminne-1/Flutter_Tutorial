import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.staff.containerBackground,
  },
  listContainer: {
    flex: 1,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.staff.contentBackground,
    marginBottom: 7,
  },
  inputFormSubContainer: {
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    marginTop: 7,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  sectionIconStyle: {
    tintColor: Theme.signin.headerTitle,
  },
  buttonContainer: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: Theme.staff.contentBackground,
  },
  button: {
    backgroundColor: Theme.staff.button,
    paddingHorizontal: 0,
    width: '100%',
  },
  filter: {
    height: 35,
    width: '100%',
  },
  country: {
    marginTop: 10,
    marginBottom: 25,
  },
  building: {
    marginBottom: 25,
  },
  title: {
    fontSize: 13,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
    marginBottom: 15,
  },
  viewRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  row: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  statusContentDropdownStyle: {
    borderColor: 'rgba(219,219,219,0.8)',
    borderWidth: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
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
  containerGroupRadioButton: {
    paddingVertical: 0,
    flex: 1,
  },
  groupRadioButton: {
    marginBottom: 15,
  },
});

export default styles;
