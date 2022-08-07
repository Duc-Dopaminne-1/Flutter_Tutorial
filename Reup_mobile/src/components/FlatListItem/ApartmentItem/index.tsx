import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';
import { CustomText } from '@components/CustomText';
import { CustomTouchable } from '@components/CustomTouchable';
import ICON_ACREAGE from '@src/res/icons/icon_acreage.png';
import ICON_BATH from '@src/res/icons/icon_bath.png';
import ICON_BED from '@src/res/icons/icon_bed.png';
import RectangleAvatar from '@components/RectangleAvatar';
import { ICompanyUnit, IUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { upperCaseFirstChar, getApartmentName } from '@src/utils';

interface Props {
  item: ICompanyUnit & IUnit;
  onPress?: (item: ICompanyUnit) => void;
}

const statusEnum = {
  WAITING: "Waiting",
  DENINED: "Denied",
  APPROVED: "Approved"
};

const ApartmentItem = (props: Props) => {
  const { item, onPress } = props;
  return (
    <CustomTouchable style={styles.container} onPress={onPress && onPress.bind(undefined, item)}>
      <View style={styles.viewContain}>
        <RectangleAvatar
          avatar={item.image_urls[0]}
          width={96}
          height={72}
          resizeMode={'stretch'} />
        <View style={styles.textView}>
          <CustomText numberOfLines={1}
            style={styles.title}
            text={getApartmentName(item.block, item.floor, item.code)} />
          <CustomText numberOfLines={1} style={styles.apartmentOwner} text={upperCaseFirstChar(item.status ?? '')} />
          <View style={styles.viewMore}>
            <View style={styles.viewMoreContainer}>
              <Image source={ICON_ACREAGE} resizeMode='contain' />
              <CustomText numberOfLines={1} style={styles.subTitle} text={`${item.square}m2`} />
            </View>
            <View style={styles.viewMoreContainer}>
              <Image source={ICON_BATH} resizeMode='contain' />
              <CustomText numberOfLines={1} style={styles.subTitle} text={`${item.restroom}`} />
            </View>
            <View style={styles.viewMoreContainer}>
              <Image source={ICON_BED} resizeMode='contain' />
              <CustomText numberOfLines={1} style={styles.subTitle} text={`${item.bedroom}`} />
            </View>
          </View>
        </View>
      </View>
    </CustomTouchable>
  );
};

export default React.memo(ApartmentItem);
