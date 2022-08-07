import { StyleSheet } from "react-native";
import { Theme } from "@src/components/Theme";
import { fonts, WIDTH } from "@src/constants/vars";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  containerTouchable: {
    flex: 1,
    height: 86,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    height: 20,
    width: 20,
  },
  logoCheckbox: {
    marginEnd: 0
  },
  image: {
    height: 40,
    width: 40,
    marginStart: 10,
    borderRadius: 2,
  },
  midleContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginStart: 14,
  },
  textName: {
    color: Theme.category_details_item.textColorName,
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
  },
  textDescription: {
    color: Theme.category_details_item.textColorDescription,
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    marginTop: 8,
  },
  customBtn: {
    width: WIDTH * 0.25,
    paddingHorizontal: 0,
    height: 25,
  },
  textCustomBtn: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
  },
  dotline: {
    width: '100%',
  }
});
