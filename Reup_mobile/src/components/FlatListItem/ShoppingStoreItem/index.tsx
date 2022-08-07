import { CustomTouchable } from "@src/components/CustomTouchable";
import React from "react";
import { View, Image } from "react-native";
import { CustomText } from "@src/components/CustomText";
import { styles } from "./styles";
import { IProductGetResponse } from "@reup/reup-api-sdk/libs/api/shopping_store/models";
import { formatCurrency, upperCaseFirstChar } from "@src/utils";
import IMAGE_DEFAULT from '@res/icons/ForLeaseForSale/image-default.jpg';
import { CustomCheckBox } from "@src/components/CustomCheckBox";
import CustomTextTicker from "@src/components/CustomTextTicker";

interface Props {
  item: ShoppingStoreItemModal;
  onPressCheck?: (item: ShoppingStoreItemModal) => void;
  onPressDetail?: (item: ShoppingStoreItemModal) => void;
  isOdd: boolean;
}

export type ShoppingStoreItemModal = {
  product: IProductGetResponse;
  type: ShoppingStoreType;
  isSelected: boolean;
}

export enum ShoppingStoreType {
  WHOLE_STORE = "Whole store",
  MY_SHOP = "My shop"
}

const ShoppingStoreItem = (props: Props) => {
  const { item, isOdd, onPressDetail, onPressCheck } = props;
  const { thumbnail, name, description, price, status, currency } = item.product;

  const onPressCheckBox = (item: ShoppingStoreItemModal) => {
    onPressCheck && onPressCheck(item);
  }

  return (
    <CustomTouchable
      style={[styles.container, isOdd ? { marginEnd: 7.5 } : { marginStart: 7.5 }]}
      onPress={onPressDetail && onPressDetail.bind(undefined, item)}
    >
      <View style={styles.viewContain}>
        {thumbnail
          ? <Image style={styles.thumbnail} resizeMode='cover' source={{ uri: thumbnail }} />
          : <Image style={styles.thumbnail} resizeMode='cover' source={IMAGE_DEFAULT} />}
        <CustomText numberOfLines={1} style={styles.title} text={name ?? ''} />
        <CustomText numberOfLines={2} styleContainer={{ height: 40 }} style={styles.description} text={description ?? ''} />
      </View>
      <View style={[styles.viewBottom]}>
        <CustomTextTicker
          styleContainer={styles.containerPrice}
          styleText={styles.price}
          text={formatCurrency(price, currency ?? 'USD')}
          numberOfLines={1}
        />
        {item.type === ShoppingStoreType.MY_SHOP ?
          <CustomText
            style={[styles.status]}
            text={status ? upperCaseFirstChar(status) : ''} />
          : null}
      </View>
      {item.type === ShoppingStoreType.MY_SHOP ?
        <CustomCheckBox
          stylesContainer={styles.checkbox}
          isCheck={item.isSelected}
          onPress={onPressCheckBox && onPressCheckBox.bind(undefined, item)}
        /> : null
      }
    </CustomTouchable >
  );
};

export default React.memo(ShoppingStoreItem);
