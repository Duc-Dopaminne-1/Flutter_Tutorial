import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: Theme.edit_member.backgroundColorSectionHeader,
    marginTop: 7,
  },
  iconSectionHeader: {
    tintColor: Theme.edit_member.tintColorIconSectionHeader,
    width: 15,
    height: 15,
  },
  titleSectionHeader: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 13,
    color: Theme.edit_member.textColorTitleSectionHeader,
  },
  containerInputFields: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 20,
    marginBottom: 7,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
    backgroundColor: Theme.recurring.contentBackground,
  },
  button: {
    width: '95%',
    backgroundColor: Theme.recurring.save_button,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  groupRadioButton: {
    marginEnd: WIDTH / 3,
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
  containerInputAssignee: {
    height: 66,
  },
  containerInputNote: {
    height: 74,
  },
  titleInterval: {
    fontSize: 13,
    color: Theme.edit_recurring_task.textColorInterval,
    fontFamily: fonts.MontserratMedium,
    marginBottom: 20,
  },
  intervalContainer: {
    alignItems: 'flex-start',
  },
  intervalContents: {
    flexDirection: 'row',
  },
  intervalInput: {
    width: 70,
  },
  intervalDropdown: {
    flex: 1,
    marginLeft: 17,
  },
  interval: {
    height: 35,
    width: '100%',
  },
  keyboardAccessory: {
    padding: 0,
    height: 45,
  },
});

export default styles;
