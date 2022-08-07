import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import { formatPrice } from '@src/utils';
import DefaultImage from '@src/components/DefaultImage';

interface Props {
  url: string;
  title: string;
  price: string;
  date: string;
  quantity: string;
}

const OrdersItem = (props: Props) => {
  const { url, title, price, date, quantity } = props;

  return (
    <View style={styles.container}>
      <DefaultImage
        imageUri={url}
        imageStyle={styles.image}
        resizeMode={url ? 'contain' : 'cover'} />
      <View style={styles.textContainer}>
        <CustomText numberOfLines={2} style={styles.title} text={title} />
        <CustomText numberOfLines={3} style={styles.date} text={`${formatPrice(price)}  •  ${date}`} />
        <CustomText numberOfLines={1} style={styles.date} text={`Quantity: ${quantity}`} />
      </View>
    </View>
  );
};

export { OrdersItem };
