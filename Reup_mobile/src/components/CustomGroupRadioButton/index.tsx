import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import { styles } from "../CustomGroupRadioButton/styles";
import { CustomText } from "../CustomText";
import { CustomFlatList } from "../FlatList";
import { CustomTouchable } from "../CustomTouchable";

interface Props {
  style?: ViewStyle | ViewStyle[];
  radioBtnsData: RadioButtonObject[];
  defaultSelected?: RadioButtonObject;
  onDataChange: (obj: RadioButtonObject) => void;
  title?: string;
  styleTitle?: ViewStyle | ViewStyle[];
  styleCustomFlatList?: ViewStyle | ViewStyle[];
  numColumns?: number;
  styleLabelRadioBtn?: ViewStyle | ViewStyle[];
  styleContainerRadioBtn?: ViewStyle | ViewStyle[];
  styleCustomRadioBtn?: ViewStyle | ViewStyle[];
  styleActiveRadioBtn?: ViewStyle | ViewStyle[];
  styleContainerTextTilte?: ViewStyle | ViewStyle[];
}

export interface RadioButtonObject {
  label: string;
  key: number;
}

const CustomGroupRadioButton = (props: Props) => {
  const {
    radioBtnsData,
    defaultSelected,
    style,
    onDataChange,
    title,
    styleTitle,
    styleCustomFlatList,
    numColumns = 2,
    styleLabelRadioBtn,
    styleContainerRadioBtn,
    styleCustomRadioBtn,
    styleActiveRadioBtn,
    styleContainerTextTilte,
  } = props;

  const [selected, setSelected] = useState<RadioButtonObject>(defaultSelected ? defaultSelected : radioBtnsData[0]);

  const onPress = (item: RadioButtonObject) => {
    setSelected(item);
    onDataChange(item);
  };

  const onLoad = (page: number, onLoadSuccess: () => {}, onLoadFailure: () => {}) => {

  };

  const renderRadioButton = (item: RadioButtonObject) => {
    return <CustomTouchable
      style={[styles.containerRadiusBtn, styleContainerRadioBtn]}
      onPress={() => { onPress(item); }}>
      <View style={[styles.customRadioBtn, item.key == selected.key ? styles.activeCustomRadioBtn : null, styleCustomRadioBtn]}>
        {item.key == selected.key ?
          <View style={[styles.activeRadioBtn, styleActiveRadioBtn]} />
          : null}
      </View>
      <CustomText
        text={item.label}
        style={[styles.labelRadioButton, styleLabelRadioBtn]}
        numberOfLines={1}
      />
    </CustomTouchable>;
  };

  return (
    <View style={[styles.container, style]}>
      {title ? <CustomText
        text={title}
        style={[styles.textTitle, styleTitle]}
        styleContainer={[styles.containerTextTitle, styleContainerTextTilte]} />
        : null}
      <CustomFlatList
        scrollEnabled={false}
        style={[styles.customFlatList, styleCustomFlatList]}
        data={radioBtnsData}
        numColumns={numColumns}
        renderItem={renderRadioButton}
        onLoad={onLoad}
      />
    </View >
  );
};

export default React.memo(CustomGroupRadioButton);
