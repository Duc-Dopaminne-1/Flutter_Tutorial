import { StyleSheet } from "react-native";
import { Theme } from "../Theme";
import { fonts } from "@src/constants/vars";

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    height: 30
  },
  dropdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentDropdownStyle: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.filter_button.backgroundColorContentDropDown,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  arrowImage: {
    marginTop: 5,
    width: 9,
    height: 5,
    marginLeft: 7,
    tintColor: Theme.filter_button.tintColorArrowIcon,
  },
  textStyle: {
    flex: 1,
    color: Theme.filter_button.textColor,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    textAlign: "center"
  }
});
