import { StyleSheet } from 'react-native';
import { fonts, INPUT_WIDTH } from '@src/constants/vars';
import { Theme } from '@src/components/Theme/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInput: {
    flex: 1,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.new_building.background,
  },
  headerTitle: {
    backgroundColor: Theme.new_building.header_title,
    marginTop: 7,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: Theme.new_building.background,
  },
  content: {
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Theme.new_building.background,
    borderRadius: 1,
  },
  titleContainer: {
    width: '100%',
    marginBottom: 15,
  },
  dropdownWrapper: {
    // marginTop: 5,
  },
  contentDropdownStyle: {
    width: INPUT_WIDTH,
    height: 35,
    justifyContent: 'center',
    paddingLeft: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.new_building.inputBorder,
    borderRadius: 2,
  },
  dropdownContainer: {
    height: 35,
  },
  textStyle: {
    width: '90%',
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    color: Theme.new_building.text,
  },
  arrowImage: {},
  buttonContainer: {
    padding: 20,
    flexDirection: 'column',
    marginTop: 10,
    backgroundColor: Theme.new_building.button_background,
    borderRadius: 1,
  },
  button: {
    backgroundColor: Theme.new_building.button,
    width: '90%',
  },
  buttonText: {
    fontSize: 13,
  },
  imagesList: {
    marginTop: 15,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  inputStyle: {
    color: Theme.personal_info.inputStyle,
    fontSize: 11,
  },
});

export default styles;
