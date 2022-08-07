import { StyleSheet } from "react-native";
import { WIDTH, WIDTH_RATIO, colors } from "@src/constants/vars";

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: ((WIDTH - 40) / 2) * WIDTH_RATIO,
    width: (((WIDTH - 40) * 3) / 4) * WIDTH_RATIO,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.DARK_GREY
  },
  videoView: {
    width: "100%",
    height: "100%",
  },
  darkLayout: {
    position: 'absolute',
    width: "100%", height: "100%",
    backgroundColor: 'black',
    opacity: 0.3,
  }
});

export default styles;
