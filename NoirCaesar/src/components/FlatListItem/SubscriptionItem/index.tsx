import styles from './styles';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { SUBSCRIPTION_DOT_ACTIVE, SUBSCRIPTION_DOT_INACTIVE } from '@src/constants/icons';
import { ISubscriptionPackage } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';

interface Props {
  item: ISubscriptionPackage;
  isActive: boolean;
  disableButton?: boolean;
  onPressItem: () => void;
}

const SubscriptionItem = (props: Props) => {
  const { item, isActive, disableButton, onPressItem } = props;

  const price = `$${item.amount}`;
  const text = item.description && item.description.replace('Subscription for', '');
  const subscriptionIcon = isActive ? SUBSCRIPTION_DOT_ACTIVE : SUBSCRIPTION_DOT_INACTIVE;

  return (
    <CustomTouchable
      disabled={disableButton}
      activeOpacity={0.8}
      style={[styles.container, { opacity: disableButton ? 0.5 : 1 }]}
      onPress={onPressItem}
    >
      <FastImage style={styles.subscriptionDot} source={subscriptionIcon} />
      <CustomText numberOfLines={1} text={`${price} ${text}`} style={styles.subscriptionText} />
    </CustomTouchable>
  );
};

export { SubscriptionItem };
