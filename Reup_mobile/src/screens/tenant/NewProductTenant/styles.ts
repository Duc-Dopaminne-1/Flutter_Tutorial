import { Theme } from '@src/components/Theme';
import { fonts } from '@src/constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    marginTop: 7,
    backgroundColor: Theme.new_product.backgroundSectionHeader,
  },
  iconSectionHeader: {
    width: 15,
    height: 15,
    tintColor: Theme.new_product.tintColorIconSectionHeader,
  },
  titleSectionHeader: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 13,
    color: Theme.new_product.textColorTitleSectionHeader,
  },
  listContainer: {
    flex: 1,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.new_product.backgroundColorScrollView,
  },
  contentContainerScrollView: {
    padding: 15,
  },
  buttonContainer: {
    marginTop: 8,
    height: 80,
    backgroundColor: Theme.new_product.backgroundColorContainerSubmitBtn,
  },
  button: {
    width: '88%',
    height: 40,
    marginTop: 13,
    backgroundColor: Theme.new_product.backgroundColorSubmitBtn,
  },
  containerInputProductName: {
    marginTop: 15,
  },
  errorMessage: {
    height: 20,
    width: '100%',
  },
  dropdownCategory: {
    height: 35,
    width: '100%',
  },
  dropdownCurrency: {
    height: 35,
    width: '100%',
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: Theme.new_product.backgroundColorModal,
  },
  containerInputPrice: {
    marginTop: 15,
  },
  description: {
    height: 75,
  },
  imagesList: {
    marginTop: 15,
  },
});

export default styles;
