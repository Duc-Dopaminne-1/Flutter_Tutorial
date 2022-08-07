import {
  colors,
  WIDTH,
  HEIGHT,
  FONT_SIZE_SM,
  fonts
} from "@constants/vars";
import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: WIDTH * 0.8,
  },

  text: {
    fontSize: 16,
    color: "#212B36",
    lineHeight: 20,
    fontFamily: fonts.MontserratRegular,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },

  errorIconStyle: {
    marginRight: 6,
  },

  errorText: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 14,
    color: "red",
    flex: 1
  },

  modalDropdown: {
    justifyContent: "center",
  },

  modalDropdownView: {
    height: "100%",
    flexDirection: "row",
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: "center",
    justifyContent: "space-between"
  },

  modalDropdownText: {
    fontSize: 13,
    color: "#212B36",
    fontFamily: fonts.MontserratRegular,

  },
  buttonContainer: {
    flexDirection: 'row'
  },

  lineBottom: {
    height: 1,
    marginTop: 20
  },
  iconArrowStyles: {
    width: 20,
    height: 10,
    margin: 5,
    marginTop: 10, marginBottom: 10
  },
  titleTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: 5, marginRight: 5
  },
  titleTextStyle: {
    color: '#979797',
    fontFamily: fonts.MontserratRegular,
    fontSize: 15
  }
});

export default styles;
