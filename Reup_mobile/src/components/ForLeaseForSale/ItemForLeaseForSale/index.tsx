import React from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import styles from './styles';
import IMAGE_DEFAULT from '@res/icons/ForLeaseForSale/image-default.jpg';
import { PostType } from '..';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { BulletinPostStatus } from '@reup/reup-api-sdk/libs/api/enum';
import moment from 'moment';
import { Config } from '@src/configs/appConfig';
import { upperCaseFirstChar, formatCurrency } from '@src/utils';
import { CustomText } from '@src/components/CustomText';

export interface Props {
  item: any,
  isShowType?: PostType,
  onPress: (data: any) => void,
  isShowStatus?: boolean,
}

export type PostItemModal = {
  thumbnail: string,
  title: string,
  description: string,
  price: number,
  type: PostTypeFor,
  companyId?: string,
  created?: string,
  creator?: any,
  currency?: string,
  id: string,
  imageURLs?: string[],
  isRemove?: boolean,
  modified?: string,
  propertyId?: string,
  status?: BulletinPostStatus,
  per?: string,
  unit?: any,
};

export enum PostTypeFor {
  FOR_LEASE = "For Lease",
  FOR_SALE = "For Sale"
}


const ItemForLeaseForSale = (props: Props) => {
  const { item, isShowType = PostType.LEASESALESHOW, isShowStatus = true } = props;
  const { thumbnail, title, created, modified, description, type, price, per, currency, status } = item;

  const onPressItem = () => {
    props.onPress(props.item)
  }

  const displayPrice = `${formatCurrency(price, currency)}${type === PostTypeFor.FOR_LEASE ? `/` + upperCaseFirstChar(per) : ``}` ?? '';

  return (
    <TouchableHighlight onPress={onPressItem} style={styles.touchableHighlight}>
      <View style={styles.containers}>
        <View style={styles.contents}>
          <RectangleAvatar
            avatar={thumbnail}
            width={96}
            height={72}
          />
          <View style={isShowType == PostType.LEASESALESHOW ? styles.contentsRight2 : styles.contentsRight}>
            <View style={styles.headers}>
              <CustomText style={styles.title} numberOfLines={1}
                text={title ?? ''}
                styleContainer={{ flex: 1, alignItems: 'flex-start' }}
              />
              <CustomText style={styles.date} numberOfLines={1}
                text={moment(modified).format(Config.Manager.formatDate) ?? ''}
                styleContainer={{ alignItems: 'flex-start' }}
              />
            </View>
            <View style={styles.descriptionContainer}>
              <CustomText numberOfLines={2} style={styles.description} text={description ?? ''} />
            </View>
            {isShowType == PostType.LEASESALESHOW ? (
              <View style={styles.priceContainer}>
                <CustomText style={styles.price2} numberOfLines={1}
                  text={displayPrice}
                />
                {isShowStatus && (
                  <CustomText style={[styles.price2,
                  status === BulletinPostStatus.Pending ? { color: '#1B72BF' } : {},
                  status === BulletinPostStatus.Approved ? { color: '#1FA207' } : {},
                  status === BulletinPostStatus.Denied ? { color: '#707070' } : {}]}
                    numberOfLines={1}
                    text={upperCaseFirstChar(status)}
                  />)}
              </View>
            ) : null}

          </View>
        </View>
        <View style={[styles.descriptionContainer, styles.viewPrice]}>
          {type && isShowType == PostType.BOTH ? (
            <CustomText style={styles.price} numberOfLines={1}
              text={displayPrice}
            />
          ) : null}
          {type && isShowType == PostType.BOTH ? (
            <CustomText style={styles.subTitle} numberOfLines={1}
              text={type ?? ''}
            />
          ) : null}
        </View>
      </View>
    </TouchableHighlight >
  );
};

export default React.memo(ItemForLeaseForSale);
