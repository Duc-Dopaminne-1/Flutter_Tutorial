import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  sectionIconStyle: {
    tintColor: Theme.new_manager.section_icon_color,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
    height: 66,
    marginBottom: 0,
    justifyContent: 'center',
    backgroundColor: Theme.new_manager.contentBackground,
  },
  sectionHeader: {
    marginTop: 7,
    backgroundColor: Theme.new_manager.backgroundColorSectionHeader,
  },
  button: {
    backgroundColor: Theme.new_manager.button,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.new_manager.contentBackground,
  },
  inputFormSubContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Theme.new_manager.contentBackground,
    borderRadius: 1,
  },
  dropdownContainer: {
    height: 35,
    width: '100%',
  },
  textStyle: {
    width: '90%',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.new_manager.text,
  },
});

export default styles;
