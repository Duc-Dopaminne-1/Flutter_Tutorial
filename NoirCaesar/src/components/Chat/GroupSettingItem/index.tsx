import React from "react";
import { View, Image } from "react-native";
import { CustomText } from "@src/components/CustomText";
import styles from "./styles";
import { CustomTouchable } from "@src/components/CustomTouchable";
import { ARROW_RIGHT } from "@src/constants/icons";

interface Props {
  key: string;
  title: string;
  lineBottom?: boolean;
  onPressItem?: () => void;
}

const GroupSettingItem = (props: Props) => {
  const {
    key,
    title,
    lineBottom,
    onPressItem
  } = props;

  const lineBottomStyle = lineBottom ? styles.lineBottom : {};

  return (
    <CustomTouchable
      activeOpacity={0.8}
      onPress={onPressItem}
      style={[styles.container, lineBottomStyle]}>
      <View style={styles.textContainer}>
        <CustomText
          style={styles.title}
          text={title}
        />
      </View>
      <Image source={ARROW_RIGHT} />
    </CustomTouchable>
  )
}

export default GroupSettingItem;
