import React, { useState } from "react";
import { styles } from "@src/components/FlatListItem/CategoryDetailsItem/styles";
import { TouchableOpacity, View } from "react-native";
import { CustomCheckBox } from "@src/components/CustomCheckBox";
import { ItemFlatList } from "@src/screens/manager/CategoryDetails";
import FastImage from "react-native-fast-image";
import { CustomText } from "@src/components/CustomText";
import { CustomButton } from "@src/components/CustomButton";
import translate from "@src/localize";
import { Theme } from "@src/components/Theme";
import { Image } from "react-native-animatable";
import IMAGE_DOT_LINE from "src/res/icons/ForLeaseForSale/image-line-dot.png";
import { CustomTouchable } from "@src/components/CustomTouchable";

interface Props {
  object: ItemFlatList;
  onPressActiveBtn: (obj: ItemFlatList) => void;
  onPress: (obj: ItemFlatList) => void;
}


const CategoryDetailsItem = (props: Props) => {

  const { object, onPress, onPressActiveBtn } = props;

  const [isChecked, setChecked] = useState<boolean>(object.isChecked);
  const [isActive, setActive] = useState<boolean>(object.isActive);

  const onPressItem = () => {
    object.isChecked = !isChecked;
    onPress(object);
    setChecked(!isChecked);
  };

  const onPressBtn = () => {
    object.isActive = !isActive;
    onPressActiveBtn(object);
    setActive(!isActive);
  };

  const textColorCustomBtn = isActive ? Theme.category_details_item.textColorActive : Theme.category_details_item.textColorInactive;

  const backgroundColorCustomBtn = isActive ? Theme.category_details_item.backgroundActive : Theme.category_details_item.backgroundInactive;

  return (
    <View style={styles.container}>
      <CustomTouchable style={styles.containerTouchable} onPress={onPressItem}>
        <CustomCheckBox
          styleLogo={styles.logoCheckbox}
          stylesContainer={styles.checkbox}
          isCheck={isChecked}
          onPress={onPressItem}
        />
        <FastImage source={{ uri: object.image }} resizeMode='cover' style={styles.image} />
        <View style={styles.midleContent}>
          <CustomText style={styles.textName} text={object.name} numberOfLines={1} />
          <CustomText style={styles.textDescription} text={object.description} numberOfLines={1} />
        </View>
        <CustomButton
          textStyle={[styles.textCustomBtn, { color: textColorCustomBtn }]}
          style={[styles.customBtn, { backgroundColor: backgroundColorCustomBtn }]}
          text={isActive ? translate("category_details.active") : translate("category_details.inactive")}
          onPress={onPressBtn}
        />
      </CustomTouchable>
      <Image style={styles.dotline} source={IMAGE_DOT_LINE} />
    </View>
  );
};

export default React.memo(CategoryDetailsItem);
