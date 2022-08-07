import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.new_post.backgroundColor,
    flex: 1
  },
  bottomButtonView: {
    flexDirection: 'row',
    height: 66,
    paddingHorizontal: 20,
    backgroundColor: Theme.new_post.bottomButtonContainerBackgroundColor,
    marginTop: 8
  },
  submitButton: {
    backgroundColor: Theme.new_post.submitButtonBackgroundColor
  },
  iconHeader: {
    tintColor: Theme.new_post.sectionHeaderColor
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Theme.new_post.contentContainerBackgroundColor,
  },
  headerContainer: {
    marginTop: 8,
    backgroundColor: Theme.new_post.contentContainerBackgroundColor,
  },
  formikContainer: {
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 1,
    backgroundColor: Theme.new_post.contentContainerBackgroundColor,
    paddingTop: 17
  },
  contentDropdownStyle: {
    width: '100%',
    height: 35,
    paddingLeft: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.new_post.inputBorder,
    borderRadius: 2,
  },
  dropdownContainer: {
    height: 35,
  },
  textStyle: {
    width: '90%',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.new_post.text,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
  },
  priceInput: {
    width: '40%'
  },
  textCurrencyStyle: {
    width: 50,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.new_post.text,
  },
  contentCurrencyDropdown: {
    width: 90,
    height: 35,
    justifyContent: 'center',
    paddingHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.new_post.inputBorder,
    borderRadius: 2,
  },
  currencyContainer: {
    flex: 0,
    alignSelf: 'flex-end',
    marginLeft: 20,
    width: 90,
  },
  currencyBounds: {
    height: 35,
    width: 90
  },
  contentPerDropdown: {
    height: 35,
    justifyContent: 'center',
    paddingHorizontal: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.new_post.inputBorder,
    borderRadius: 2,
  },
  perContainer: {
    alignSelf: 'flex-end',
    marginLeft: 4,
    height: 35,
    width: 100,
  },
  perBounds: {
    height: 35,
  },
  permonthContainer: {
    marginLeft: 5,
    marginBottom: 8,
  },

  descriptionsContainer: {
    height: 75,
    alignSelf: 'baseline'
  },
  imagesList: {
    marginTop: 15
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
});
export default styles;

