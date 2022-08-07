import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';
import { CustomText } from '../../CustomText';
import { COINS } from '@src/constants/icons';
import translate from '@src/localize';
import { CustomTouchable } from '../../CustomTouchable';

interface Props {
  title: string;
  original?: number;
  bonus?: number;
  price?: number;
  currency?: string;
  onItemClick?: () => void;
}

const BuyCoinsItem = (props: Props) => {
  const { original, bonus, title, price = 0, currency, onItemClick } = props;

  const renderTopInfo = () => {
    return (
      <View style={styles.textContainer}>
        <CustomText style={styles.coinsTitle} text={title} />
        <Image resizeMode="contain" source={COINS} style={styles.iconCoins} />
      </View>
    );
  };

  const renderBottomInfo = () => {
    return (
      <View style={[styles.textContainer, { marginTop: 5 }]}>
        {original && <CustomText style={[styles.coinsInfo, { color: '#484857' }]} text={`${original}${bonus ? ' + ' : ''}`} />}
        {bonus && <CustomText style={[styles.coinsInfo, { color: '#FF0000' }]} text={`${bonus} ${translate('buy_coins.bonus')}`} />}
      </View>
    );
  };

  const renderInfo = () => {
    return (
      <View style={{ flex: 1 }}>
        {renderTopInfo()}
        {renderBottomInfo()}
      </View>
    );
  };

  const renderPrice = () => {
    const priceText = currency + ' ' + price.toFixed(2);

    return (
      <View style={styles.priceContainer}>
        <CustomText style={styles.priceText} text={priceText} />
      </View>
    );
  };

  return (
    <CustomTouchable activeOpacity={0.8} onPress={onItemClick} style={styles.itemContainer}>
      {renderInfo()}
      {renderPrice()}
    </CustomTouchable>
  );
};

export default BuyCoinsItem;
