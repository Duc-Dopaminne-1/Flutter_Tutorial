import { StyleSheet } from "react-native";
import { fonts } from "@src/constants/vars";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginLeft: 26, paddingRight: 20,
    paddingVertical: 30,
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-start"
  },
  title: {
    fontFamily: fonts.AvenirLTStdRoman,
    fontSize: 14, color: "#FFFFFF",
  },
  lineBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#676877",
  }
});

export default styles;
