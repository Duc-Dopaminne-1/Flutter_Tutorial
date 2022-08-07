import { StyleSheet } from "react-native";
import { fonts } from "@src/constants/vars";
import { Theme } from "../Theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customFlatList: {
    flexGrow: 0,
  },
  containerRadiusBtn: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  customRadioBtn: {
    height: 18,
    width: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Theme.group_radio_button.normalBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCustomRadioBtn: {
    borderColor: Theme.group_radio_button.borderColorCustomRadioBtn,
  },
  activeRadioBtn: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Theme.group_radio_button.backgroundColorActiveRadioBtn,
  },
  textTitle: {
    textAlign: 'left',
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.group_radio_button.colorTextTitle
  },
  containerTextTitle: {
    alignItems: 'flex-start'
  },
  labelRadioButton: {
    marginStart: 11,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.group_radio_button.colorLableTitle
  }
});
