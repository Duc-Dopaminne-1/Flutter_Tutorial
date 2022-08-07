import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import styles from './styles';
import { CustomText } from '../CustomText';
import { CustomTouchable } from '@components/CustomTouchable';
import IMAGE_DEFAULT from '@res/icons/ForLeaseForSale/image-default.jpg';
import RectangleAvatar from '../RectangleAvatar';
import { ShoppingProductStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { upperCaseFirstChar } from '@src/utils';
import { Theme } from '../Theme';
{
  /* <ProductItem description={'Lorem ipsum dolor sit amet, consec tetur adipiscing elit'}
                price={'$62'} /> */
}

interface Props {
  icon?: string;
  name?: string;
  description?: string;
  price?: string;
  isLineBottom?: boolean;
  isShowStatus?: boolean;
  status?: string;
  onPress?: () => void;
}

const ProductItem = (props: Props) => {
  const { icon, name, description, price, isLineBottom = true, onPress, status, isShowStatus } = props;
  let statusColor = ""
  switch (status) {
    case upperCaseFirstChar(ShoppingProductStatus.Waiting.valueOf()):
      statusColor = Theme.productItem.waiting
      break;
    case upperCaseFirstChar(ShoppingProductStatus.Denied.valueOf()):
      statusColor = Theme.productItem.denied
      break;
    case upperCaseFirstChar(ShoppingProductStatus.Approved.valueOf()):
    default:
      statusColor = Theme.productItem.approved
      break;
  }

  return (
    <CustomTouchable style={styles.container} onPress={onPress}>
      <View style={styles.viewContain}>
        <RectangleAvatar
          width={96}
          height={72}
          resizeMode={'cover'}
          avatar={icon}
        />
        <View style={styles.textView}>
          <CustomText numberOfLines={1} style={styles.title} text={name ?? ''} />
          <CustomText numberOfLines={2} style={styles.description} text={description ?? ''} />
          <View style={styles.moneyView}>
            <CustomText numberOfLines={1} style={styles.price} text={price ?? ''} />
            {isShowStatus ? <CustomText numberOfLines={1} style={[styles.status, { color: statusColor }]} text={props.status ?? ''} /> : null}
          </View>
        </View>
      </View>
      {isLineBottom ? <View style={styles.divider} /> : null}
    </CustomTouchable>
  );
};

export default React.memo(ProductItem);
