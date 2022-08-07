import React from "react";
import DropdownNative, { Props } from "../Dropdown/DropdownNative";
import { styles } from "./styles";
import { ViewStyle, View } from "react-native";

interface FilterProps extends Props {
  mainContainerStyle?: ViewStyle | ViewStyle[]
}

export const FilterButton = (props: FilterProps) => {
  const { mainContainerStyle } = props;

  return (
    <View style={[styles.container, mainContainerStyle]}>
      <DropdownNative
        contentDropdownStyle={styles.contentDropdownStyle}
        containerStyle={styles.dropdownContainer}
        textStyle={styles.textStyle}
        isShowAccessory={true}
        {...props}
        iconRightStyle={styles.arrowImage}
      />
    </View>
  );
};
