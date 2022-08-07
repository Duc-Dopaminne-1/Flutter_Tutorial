import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.new_member.contentBackground,
  },
  sectionHeader: {
    backgroundColor: Theme.new_member.backgroundColorSectionHeader,
    marginTop: 7,
  },
  iconSectionHeader: {
    tintColor: Theme.new_member.tintColorIconSectionHeader,
    width: 15,
    height: 15,
  },
  titleSectionHeader: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 13,
    color: Theme.new_member.textColorTitleSectionHeader,
  },
  containerScrollView: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 8,
    backgroundColor: Theme.new_member.backgroundColorScrollView,
  },
  input: {
    marginTop: 25,
  },
  errorMessage: {
    height: 20,
    width: '100%',
  },
  dropdownRole: {
    height: 35,
    width: '100%',
  },
  imagesList: {
    marginTop: 15,
  },
  buttonContainer: {
    height: 80,
    backgroundColor: Theme.new_member.backgroundColorContainerSubmitBtn,
  },
  button: {
    width: '88%',
    height: 40,
    marginTop: 13,
    backgroundColor: Theme.new_member.backgroundColorSubmitBtn,
  },
  accessory: {
    height: 45,
  },
});

export default styles;
