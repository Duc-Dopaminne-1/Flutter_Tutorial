import React from 'react';
import { View } from 'react-native';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { styles } from './styles';
import { formatCurrency } from '@src/utils';
import { IProductGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';

type Props = {
  item: IProductGetResponse;
  onPress: (item: IProductGetResponse) => void;
}

const MyPurchaseProductItem = (props: Props) => {
  const { item, onPress } = props;
  return (
    <CustomTouchable onPress={onPress.bind(undefined, item)} style={styles.productContent}>
      <RectangleAvatar avatar={item && item.thumbnail ? item.thumbnail : item.image_urls[0]} width={80} height={60} resizeMode='contain' />
      <View style={{ marginLeft: 15, flex: 1 }}>
        <CustomText
          text={item && item.name}
          numberOfLines={2}
          style={styles.titleText}
          styleContainer={styles.titleContainer}
        />
        <View style={styles.priceContainer}>
          <CustomText
            text={item && formatCurrency(item.price, item.currency)}
            style={styles.priceText}
          />
          <CustomText
            text={item && item.created}
            style={styles.dateText}
          />
        </View>
      </View>
    </CustomTouchable>
  );
};

export default MyPurchaseProductItem;