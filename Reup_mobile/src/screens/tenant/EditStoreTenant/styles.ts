import { StyleSheet } from 'react-native';
import { WIDTH, fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.edit_store.containerBackground,
  },
  listContainer: {
    flex: 1,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.edit_store.contentBackground,
    marginBottom: 7,
  },
  inputFormSubContainer: {
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    marginTop: 7,
    backgroundColor: Theme.edit_store.backgroundColorSectionHeader,
  },
  sectionIconStyle: {
    tintColor: Theme.edit_store.headerTitle,
  },
  buttonContainer: {
    height: 80,
    backgroundColor: Theme.edit_store.contentBackground,
  },
  button: {
    backgroundColor: Theme.edit_store.button,
    width: '88%',
    height: 40,
    marginTop: 13,
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
  description: {
    height: 75,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: Theme.edit_store.backgroundColorModal,
  },
  imagesList: {
    marginTop: 15,
  },
  containerInputPrice: {
    marginTop: 15,
  },
});

export default styles;
