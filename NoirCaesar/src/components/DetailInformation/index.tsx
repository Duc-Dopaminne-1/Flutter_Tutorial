import { View, Image } from 'react-native';
import styles from './styles';
import React from 'react';
import { CustomText } from '../CustomText';
import { COINS, COINS_EARNED } from '@src/constants/icons';
import translate from '@src/localize';

interface Props {
  firstTitle: string;
  firstDetail: string;
  secondTitle?: string;
  secondDetail?: string;
  thirdTitle?: string;
  thirdDetail?: string;
  isVerified?: boolean;
  coinsPurchased?: number;
  coinsEarned?: number;
  coinsBalance?: number;
}

const DetailInformation = (props: Props) => {
  const {
    firstTitle,
    firstDetail,
    secondTitle,
    secondDetail = '',
    thirdTitle,
    thirdDetail = '',
    isVerified,
    coinsPurchased = 0,
    coinsEarned = 0,
    coinsBalance = 0,
  } = props;
  const detailWidth = isVerified ? styles.detailHalfWidth : styles.detailFullWidth;

  const renderFirstTitle = () => {
    return (
      <View style={styles.subContainer}>
        <View style={styles.infoContainer}>
          <CustomText style={styles.title} text={firstTitle} />
          <CustomText numberOfLines={2} style={[styles.detail, detailWidth]} text={firstDetail} />
        </View>
        {isVerified && (
          <View style={styles.coinsLayout}>
            <Image resizeMode="contain" source={COINS} style={styles.iconCoins} />
            <CustomText style={styles.coinsTitle} text={translate('buy_coins.coins_purchased')} />
            <CustomText style={styles.coinsText} text={coinsPurchased.toString()} />
          </View>
        )}
      </View>
    );
  };

  const renderSecondTitle = () => {
    return (
      secondTitle && (
        <View style={styles.subContainer}>
          <View style={styles.infoContainer}>
            <CustomText style={styles.title} text={secondTitle} />
            <CustomText numberOfLines={2} style={[styles.detail, detailWidth]} text={secondDetail} />
          </View>
          {isVerified && (
            <View style={styles.coinsLayout}>
              <Image resizeMode="contain" source={COINS_EARNED} style={styles.iconCoins} />
              <CustomText style={styles.coinsTitle} text={translate('buy_coins.coins_earned')} />
              <CustomText style={styles.coinsText} text={coinsEarned.toString()} />
            </View>
          )}
        </View>
      )
    );
  };

  const renderThirdTitle = () => {
    return (
      thirdTitle && (
        <View style={styles.subContainer}>
          <View style={styles.infoContainer}>
            <CustomText style={styles.title} text={thirdTitle} />
            <CustomText numberOfLines={2} style={styles.detail} text={thirdDetail} />
          </View>
          {isVerified && (
            <View style={styles.coinsLayout}>
              <Image resizeMode="contain" source={COINS} style={styles.iconCoins} />
              <CustomText style={styles.coinsTitle} text={translate('buy_coins.coins_balance')} />
              <CustomText style={styles.coinsText} text={coinsBalance.toString()} />
            </View>
          )}
        </View>
      )
    );
  };

  return (
    <View style={styles.container}>
      {renderFirstTitle()}
      {renderSecondTitle()}
      {renderThirdTitle()}
    </View>
  );
};

export { DetailInformation };
