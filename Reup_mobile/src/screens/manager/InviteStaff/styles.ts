import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  sectionIconStyle: {
    tintColor: Theme.invite_imployee.section_icon_color,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
    height: 66,
    marginBottom: 0,
    justifyContent: 'center',
    backgroundColor: Theme.invite_imployee.contentBackground,
  },
  sectionHeader: {
    marginTop: 7,
    backgroundColor: Theme.invite_imployee.backgroundColorSectionHeader,
  },
  button: {
    backgroundColor: Theme.invite_imployee.button,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.invite_imployee.contentBackground,
  },
  inputFormSubContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Theme.invite_imployee.contentBackground,
    borderRadius: 1,
  },
  contentDropdownStyle: {
    width: '100%',
    height: 35,
    paddingLeft: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.invite_imployee.inputBorder,
    borderRadius: 2,
  },
  contentDropdownRadioStyle: {
    height: 35,
    justifyContent: 'center',
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.invite_imployee.inputBorder,
    borderRadius: 2,
  },

  dropdownContainer: {
    height: 35,
  },
  textStyle: {
    width: '90%',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.invite_imployee.text,
  },
  selectStyle: {
    width: '90%',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.invite_imployee.text,
  },
  buildingTitle: {
    fontSize: 13,
    fontFamily: fonts.MontserratSemiBold,
    color: Theme.invite_imployee.buildingTitle,
  },
  buildingRadioList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  radioListContainer: {
    alignItems: 'flex-start',
  },
  radio: {
    marginBottom: 15
  },
  radioAll: {
    marginBottom: 25
  },
  radioError: {
    marginBottom: 25
  },
  buildingTitleContainer: {
    marginBottom: 15,
  },
  moreStyleDescription: {
    height: 77
  },
  containerStyleInput: {
    height: 77,
    paddingTop: 5
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
  }
});

export default styles;
