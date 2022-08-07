import { StyleSheet } from "react-native";
import { fonts, WIDTH } from "@src/constants/vars";
import { Theme } from "@src/components/Theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 8,
    backgroundColor: Theme.create_category.backgroundColorContainer
  },
  containerSubmitBtn: {
    height: 80,
    backgroundColor: Theme.create_category.backgroundContainerSubmitBtn
  },
  containerRadioBtn: {
    marginEnd: WIDTH / 3,
  },
  submitBtn: {
    width: "88%",
    height: 40,
    marginTop: 13,
    backgroundColor: Theme.create_category.backgroundSubmitBtn
  },
  textSubmitBtn: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  iconSectionHeader: {
    tintColor: Theme.create_category.tintColorIconSectionHeader
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 25
  },
});
