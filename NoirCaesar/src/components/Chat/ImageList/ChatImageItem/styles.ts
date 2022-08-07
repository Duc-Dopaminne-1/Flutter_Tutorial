import { StyleSheet } from "react-native";
import { colors, WIDTH, WIDTH_RATIO } from "@src/constants/vars";

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.DARK_GREY,
    justifyContent: 'center',
    alignItems: 'center',
    width: ((WIDTH - 30) / 3) * WIDTH_RATIO,
    height: ((WIDTH - 30) / 3) * WIDTH_RATIO,
  },
  imageOther: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    width: ((WIDTH - 30) / 3) * WIDTH_RATIO,
    height: ((WIDTH - 30) / 3) * WIDTH_RATIO,
  },
  imageOtherText: {
    fontSize: 26,
  },
});

export default styles;
