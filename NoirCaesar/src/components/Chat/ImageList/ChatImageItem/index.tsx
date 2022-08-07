import React, { useMemo } from "react";
import { CustomTouchable } from "@src/components/CustomTouchable";
import { CustomText } from "@src/components/CustomText";
import { View, Image } from "react-native";
import styles from "./styles";
import FastImage from "react-native-fast-image";

interface Props {
  item: string;
  otherImageNumber: number;
  renderOtherText: boolean;
  onItemPress: () => void;
}

const ChatImageItem = (props: Props) => {
  const {
    item,
    otherImageNumber,
    renderOtherText,
    onItemPress
  } = props;

  const renderItem = useMemo(() => {
    return (
      <CustomTouchable activeOpacity={0.8} onPress={onItemPress}>
        {renderOtherText && (
          <View style={styles.imageOther}>
            <CustomText style={styles.imageOtherText} text={otherImageNumber + '+'} />
          </View>
        )}
        <Image source={{ uri: item }} style={styles.image} />
      </CustomTouchable>
    );
  }, [item]);

  return renderItem;
}

export default ChatImageItem;
