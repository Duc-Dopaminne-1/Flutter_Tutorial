import React from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import TextTicker from 'react-native-text-ticker';
import { CustomText } from "../CustomText";
import styles from "./styles";

interface Props {
  text: string,
  styleText?: StyleProp<TextStyle>
  duration?: number,
  loop?: boolean,
  bounce?: boolean,
  repeatSpacer?: number,
  marqueeDelay?: number,
  styleContainer?: StyleProp<ViewStyle>,
  numberOfLines?: number
}

const CustomTextTicker = (props: Props) => {
  const {
    text,
    styleText,
    styleContainer,
    duration = 4000,
    loop = true,
    bounce = true,
    repeatSpacer = 10,
    marqueeDelay = 3000,
    numberOfLines = 1
  } = props;

  return (
    <View style={[styles.container, styleContainer]}>
      <TextTicker
        style={[styles.text, styleText]}
        numberOfLines={numberOfLines}
        duration={duration}
        loop={loop}
        bounce={bounce}
        isRTL={false}
        scroll={false}
        repeatSpacer={repeatSpacer}
        marqueeDelay={marqueeDelay}
      >
        {text}
      </TextTicker>
    </View>
  );
};

export default React.memo(CustomTextTicker);
