import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
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
    marginTop: 12,
    paddingHorizontal: 15,
  },
  fieldInput: {
    height: 35,
    width: '100%',
  },
  country: {
    marginTop: 10,
  },
  building: {
    marginBottom: 25,
  },
  viewRow: {
    flexDirection: 'row',
  },
  description: {
    height: 75,
  },
  imagesList: {
    marginTop: 15,
  },
  error: {
    height: 20,
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
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default styles;
