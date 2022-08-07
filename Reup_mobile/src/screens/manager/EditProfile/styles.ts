import { StyleSheet } from "react-native";
import { fonts } from "@src/constants/vars";
import { Theme } from "@src/components/Theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.myProfile.container
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader
  },
  listContainer: {
    flex: 1,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.invite_imployee.contentBackground,
  },
  dropdownContainer: {
    height: 35,
  },
  button: {
    backgroundColor: Theme.invite_imployee.button,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
    height: 66,
    marginBottom: 0,
    justifyContent: 'center',
    backgroundColor: Theme.invite_imployee.contentBackground,
  },
  contentDropdownStyle: {
    height: 35,
    justifyContent: 'center',
    paddingLeft: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.invite_imployee.inputBorder,
    borderRadius: 2,
  },
  textStyle: {
    width: '90%',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.invite_imployee.text,
  },
  inputFormSubContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Theme.invite_imployee.contentBackground,
    borderRadius: 1,
  },
});

export default styles;
