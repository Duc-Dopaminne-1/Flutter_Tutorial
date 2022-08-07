import { StyleSheet } from "react-native";
import { WIDTH } from "@src/constants/vars";

export const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",

  },
  container: {
    margin: 0,
    alignItems: undefined,
    justifyContent: undefined,
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 110,
    width: 110,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  text: {
    fontSize: 14,
    fontWeight: "400"
  }
});
