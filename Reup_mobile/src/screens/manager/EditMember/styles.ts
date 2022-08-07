import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.edit_member.contentBackground,
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
  containerScrollView: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 8,
    backgroundColor: Theme.edit_member.backgroundColorScrollView,
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
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  avatarTitle: {
    flex: 1,
    alignItems: 'flex-start',
  },
  textAvatar: {
    fontSize: 13,
    color: Theme.edit_member.textColorAvatar,
    fontFamily: fonts.MontserratMedium,
    marginBottom: 15,
  },
  changeAvatar: {
    flex: 1,
    alignItems: 'flex-end',
  },
  textChangeAvatar: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.edit_member.textColorChangeAvatar,
  },
  buttonContainer: {
    height: 80,
    backgroundColor: Theme.edit_member.backgroundColorContainerSaveBtn,
  },
  button: {
    width: '88%',
    height: 40,
    marginTop: 13,
    backgroundColor: Theme.edit_member.backgroundColorSaveBtn,
  },
  accessory: {
    height: 45,
  },
});

export default styles;
