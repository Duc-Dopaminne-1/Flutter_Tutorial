import React from 'react';
import { View, Image, StyleProp, ViewStyle } from 'react-native';
import styles from './styles';
import { CustomText } from '../CustomText';
import { CustomTouchable } from '@components/CustomTouchable';
import IMAGE_DEFAULT from '@res/icons/ForLeaseForSale/image-default.jpg';

interface Props {
  icon?: string;
  name?: string;
  description?: string;
  price?: string;
  styleContainer?: StyleProp<ViewStyle>;
  status?: string;
  isShowStatus?: boolean;
  onPress?: () => void;
}

const ProductItemGrid = (props: Props) => {
  const { icon, name, description, price, styleContainer, status, isShowStatus, onPress } = props;

  return (
    <CustomTouchable style={[styles.container, styleContainer]} onPress={onPress && onPress.bind(undefined)}>
      <View style={styles.viewContain}>
        {icon
          ? <Image style={styles.thumbnail} resizeMode='cover' source={{ uri: icon }} />
          : <Image style={styles.thumbnail} resizeMode='cover' source={IMAGE_DEFAULT} />}
        <CustomText numberOfLines={1} style={styles.title} text={name ?? ''} />
        <CustomText numberOfLines={3} styleContainer={{ height: 40 }} style={styles.description} text={description ?? ''} />
      </View>
      <View style={styles.viewBottom}>
        <View style={styles.viewPrice}>
          <CustomText numberOfLines={1} style={styles.price} text={price ?? ''} />
          {isShowStatus ? <CustomText style={[styles.status]} text={status ?? ''} /> : null}
        </View>
      </View>
    </CustomTouchable>
  );
};

export default React.memo(ProductItemGrid);
