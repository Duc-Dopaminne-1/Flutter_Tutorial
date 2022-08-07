import React from "react";
import FastImage from "react-native-fast-image";
import { styles } from "@src/components/FlatListItem/BuildingSystemItem/styles";
import { TouchableOpacity, View } from "react-native";
import { CustomText } from "@src/components/CustomText";
import RectangleAvatar from "@src/components/RectangleAvatar";
import { CustomTouchable } from "@src/components/CustomTouchable";

interface Props {
  image: string;
  name: string;
  nation: string;
  iconNation: string;
  onPress: () => void;
}

const BuildingSystemItem = (props: Props) => {

  const { image, name, nation, iconNation, onPress } = props;

  return (
    <CustomTouchable style={styles.container} onPress={onPress}>
      <RectangleAvatar
        height={40}
        width={55}
        avatar={image}
      />
      <View style={styles.content}>
        <CustomText
          style={styles.nameBuilding}
          text={name}
          numberOfLines={1}
          styleContainer={styles.containerNameBuilding} />
        <View style={styles.description}>
          <CustomText text={iconNation} />
          <CustomText
            numberOfLines={1}
            style={styles.nation}
            text={nation}
            styleContainer={styles.containerNameNation} />
        </View>
      </View>
    </CustomTouchable>
  );
};

export default React.memo(BuildingSystemItem);
