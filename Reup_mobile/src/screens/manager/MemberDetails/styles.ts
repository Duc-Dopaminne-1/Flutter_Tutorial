import { StyleSheet } from "react-native";
import { Theme } from "@src/components/Theme";
import { WIDTH, fonts } from "@src/constants/vars";

const paddingHorizontalButton = 20;
const paddingBetweenButton = 12;
const widthButton = (WIDTH - (paddingHorizontalButton * 2) - paddingBetweenButton);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.myProfile.container
  },
  bottomButtonView: {
    flexDirection: 'row',
    height: 66,
    paddingHorizontal: paddingHorizontalButton,
    backgroundColor: Theme.tenant_detail.contentBackground,
    marginTop: 7
  },
  textDeleteButton: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    textAlign: "left",
    color: Theme.tenant_detail.addItemText
  },
  widthButton: {
    width: widthButton
  },
  deleteButton: {
    marginRight: paddingBetweenButton,
    backgroundColor: Theme.tenant_detail.deleteTenantBgrButton,
  },
});

export default styles;
