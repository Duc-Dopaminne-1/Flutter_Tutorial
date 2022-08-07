import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 7,
    backgroundColor: Theme.monthly_bill.backgroundColorSectionHeader,
  },
  iconSectionHeader: {
    width: 15,
    height: 15,
    tintColor: Theme.monthly_bill.tintColorIconSectionHeader,
  },
  titleSectionHeader: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 13,
    color: Theme.monthly_bill.textColorTitleSectionHeader,
  },
  buttonContainer: {
    marginTop: 8,
    height: 80,
    backgroundColor: Theme.monthly_bill.backgroundColorContainerCreateBtn,
    justifyContent: 'center',
  },
  button: {
    width: '88%',
    height: 40,
    backgroundColor: Theme.monthly_bill.backgroundColorCreateBtn,
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
    backgroundColor: 'white',
  },
  status: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 13,
    color: 'black',
  },
  containerStatus: {
    width: '25%',
    justifyContent: 'center',
  },
  apartmentCode: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 13,
    color: 'black',
  },
  containerApartmentCode: {
    width: '50%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  monthYear: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 13,
    color: 'black',
  },
  containerMonthYear: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  line: {
    width: '100%',
  },
  contentContainerList: {
    flexGrow: 1,
  },
});

export default styles;
