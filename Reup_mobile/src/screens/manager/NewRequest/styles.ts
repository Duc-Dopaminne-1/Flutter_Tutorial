import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts } from '@src/constants/vars';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 7,
  },
  sectionHeader: {
    backgroundColor: Theme.new_apartment.contentBackground,
  },
  sectionHeaderIcon: {
    width: 15,
    height: 15,
    tintColor: Theme.new_apartment.title,
  },
  listContainer: {
    flex: 1,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.new_apartment.contentBackground,
    marginBottom: 7,
  },
  inputFormSubContainer: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 15,
  },
  buttonContainer: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: Theme.new_apartment.contentBackground,
  },
  button: {
    backgroundColor: Theme.new_apartment.button,
    paddingHorizontal: 0,
    width: '100%',
  },
  priority: {
    height: 35,
    width: '100%',
  },
  textDropdown: {
    width: '95%',
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 13,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
    marginBottom: 15,
  },
  titleContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  note: {
    height: 75,
  },
  imagesList: {
    marginTop: 15,
  },
  error: {
    height: 20,
  },
});

export default styles;
