import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { CustomTouchable } from "../CustomTouchable";

export interface ItemModal {
  item: any,
  isActive?: boolean,
}

interface Props {
  expanded?: boolean
  item: ItemModal,
  onPressItem: (item: ItemModal) => void,
  componentHeader: any
  componentContent: any,
  containerStyle?: StyleProp<ViewStyle>
}

const ExpandView = (props: Props) => {
  const { expanded = false, item, onPressItem, componentContent, componentHeader, containerStyle } = props;

  return (
    <>
      <CustomTouchable style={containerStyle} onPress={onPressItem.bind(undefined, item)}>
        {componentHeader}
      </CustomTouchable>
      {expanded
        ? componentContent
        : null}
    </>
  );
};

export default React.memo(ExpandView);
