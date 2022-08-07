import { StyleSheet } from "react-native";
import { fonts } from "@src/constants/vars";
import { Theme } from "@src/components/Theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15
  },
  containerTextCategory: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  textCategory: {
    fontSize: 15,
    fontFamily: fonts.MontserratLight,
    color: Theme.category_item.colorTextCategory
  },
});
