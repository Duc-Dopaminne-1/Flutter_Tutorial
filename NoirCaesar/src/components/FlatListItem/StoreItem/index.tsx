import styles from './styles';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CustomText } from '@src/components/CustomText';
import { IPerson } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { IProduct } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { formatPrice } from '@src/utils';
import DefaultImage from '@src/components/DefaultImage';

interface Props {
  item: IProduct;
  onPressItem?: () => void;
}

const StoreItem = (props: Props) => {
  const { item, onPressItem } = props;
  const { images, title, availability, price } = item;
  const { is_available_to_buy } = availability;
  const { excl_tax } = price;
  const image = images && images[0];

  const getPrice = () => {
    return is_available_to_buy ? `${formatPrice(excl_tax)}` : 'Out of stock';
  };

  return (
    <CustomTouchable style={styles.container} onPress={onPressItem}>
      <DefaultImage
        imageUri={image && image.original}
        imageStyle={styles.image}
        resizeMode={image && image.original ? 'contain' : 'cover'} />
      <CustomText numberOfLines={2} text={title} style={styles.title} />
      <CustomText numberOfLines={2} text={getPrice()} style={styles.price} />
    </CustomTouchable>
  );
};

export { StoreItem };
