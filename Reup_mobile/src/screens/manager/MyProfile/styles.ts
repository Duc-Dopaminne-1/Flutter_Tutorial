import { StyleSheet } from "react-native";
import { WIDTH, HEIGHT } from "@src/constants/vars";
import { Theme } from "@src/components/Theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.myProfile.container
  },
  containerScrollView: {
    paddingBottom: 15
  }
});

export default styles;
