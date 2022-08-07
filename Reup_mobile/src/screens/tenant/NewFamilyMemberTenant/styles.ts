import { StyleSheet } from 'react-native';
import { WIDTH, fonts } from '@src/constants/vars';
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
  groupRadioButton: {
    marginEnd: WIDTH / 3,
  },
  filter: {
    height: 35,
    width: '100%',
  },
  textDropdown: {
    width: '95%',
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  priority: {
    marginTop: 16,
  },
  description: {
    height: 75,
  },
  titleInterval: {
    fontSize: 13,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
  },
  intervalContainer: {
    alignItems: 'flex-start',
  },
  intervalContents: {
    flexDirection: 'row',
    marginTop: 20,
  },
  intervalInput: {
    width: 70,
  },
  intervalDropdown: {
    flex: 1,
    marginLeft: 17,
  },
  monthsOfYearContainer: {
    alignItems: 'flex-start',
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  contentContainerStyleGrid: {
    padding: 6,
  },
  containerCheckBox: {
    width: '50%',
    justifyContent: 'flex-start',
    marginTop: 19,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  titleInputText: {
    fontSize: 13,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
    marginBottom: 15
  },
  titleInputContainer: {
    alignItems: 'flex-start'
  },
  moreStyleDescription: {
    height: 77
  },
  containerStyleInput: {
    height: 77,
    paddingTop: 5
  },
  selectStyle: {
    width: '90%',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.invite_imployee.text,
  },
  imagesList: {
    marginTop: 15,
  },
  dropdownRole: {
    height: 35,
    width: '100%',
  },
});

export default styles;
