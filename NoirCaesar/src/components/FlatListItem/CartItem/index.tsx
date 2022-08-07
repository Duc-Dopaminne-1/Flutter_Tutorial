import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { CustomText } from '../../CustomText';
import { CustomTouchable } from '../../CustomTouchable';
import { IBasketLine } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { formatPrice } from '@src/utils';
import { Image } from 'react-native-animatable';
import { CLOSE } from '@src/constants/icons';

interface Props {
  item: IBasketLine;
  containerStyle?: object;
  onPlusPress?: () => void;
  onMinusPress?: () => void;
  isEditable?: boolean;
  onDeleteItem?: () => void;
}

const CartItem = (props: Props) => {
  const { containerStyle, item, onPlusPress, onMinusPress, isEditable = true, onDeleteItem } = props;
  const { product, quantity } = item;
  const { title, images, stockrecords, price } = product;
  const { excl_tax } = price;

  const renderImage = () => {
    const img = images[0];
    return <FastImage resizeMode="contain" style={styles.imageStyle} source={{ uri: img && img.original }} />;
  };

  const renderCustomText = (style: object, text: string | number) => {
    return <CustomText style={style} text={`${text}`} />;
  };

  const renderQuantityView = () => {
    return (
      <View style={styles.quantityStyle}>
        {renderCustomText(styles.quantityText, 'Quantity:')}
        {renderQuantityNumber()}
      </View>
    );
  };

  const renderQuantityNumber = () => {
    if (isEditable) {
      return (
        <View style={styles.quantityShape}>
          <CustomTouchable onPress={onPlusPress} style={styles.quantityNumView}>
            {renderCustomText([styles.quantityText, { fontSize: 16, marginRight: 0 }], '+')}
          </CustomTouchable>

          <View style={styles.quantityNumMiddleView}>{renderCustomText(styles.quantityNum, quantity)}</View>

          <CustomTouchable onPress={onMinusPress} style={styles.quantityNumView}>
            <View style={{ backgroundColor: '#676877', width: 10, height: 1 }} />
          </CustomTouchable>
        </View>
      );
    } else {
      return renderCustomText(styles.quantityText, quantity);
    }
  };

  const renderDeleteButton = () => {
    return (
      <CustomTouchable style={{ position: 'absolute', right: 0 }} onPress={onDeleteItem}>
        <Image source={CLOSE} />
      </CustomTouchable>
    );
  };

  const renderInfo = () => {
    const stock = stockrecords && stockrecords[0];
    return (
      <View style={styles.infoContainer}>
        {renderCustomText(styles.titleStyle, title)}
        {renderCustomText(styles.codeStyle, `SKU: ${stock && stock.partner_sku}`)}
        {renderCustomText(styles.priceStyle, `${formatPrice(excl_tax * quantity)}`)}
        {renderQuantityView()}
        {!isEditable && renderDeleteButton()}
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderImage()}
      {renderInfo()}
    </View>
  );
};

export default CartItem;
