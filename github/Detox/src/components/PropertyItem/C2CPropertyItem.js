import React from 'react';
import {StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';

import {UPDATE_ITEM_STRATEGY} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {FONT_BOLD} from '../../assets/fonts';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import MeasureUtils from '../../utils/MeasureUtils';
import FollowButton from '../Button/FollowButton';
import ImageProgress from '../ImageProgress';
import {SizeBox} from '../SizeBox';
import {TagStatus} from '../TagStatus';

export type ModeC2CPropertyItem = 'your-post' | 'saved-post';

type C2CPropertyItemTypes = {
  mode: ModeC2CPropertyItem,
  onPress: Function,
  item: {
    images: String,
    isFollowed: Boolean,
    propertyPostId: String,
    title: String,
    address: String,
    price: String,
    buildingArea: String,
    direction: String,
    createdDatetime: String,
    status: String,
    statusStyle: ViewStyle,
    statusTextStyle: TextStyle,
  },
};

const HEIGHT = {
  banner: 257,
  header: {
    margin: SIZES.MARGIN_4,
    address: 22,
  },
  center: 48,
  bottom: 48,
  border: SIZES.BORDER_WIDTH_1,
  padding: SIZES.PADDING_12,
  paddingScreen: SIZES.PADDING_16,
  marginItem: SIZES.MARGIN_16,
};

const FONT_DEFAULT = SIZES.FONT_16;

export const ItemC2CPropertyHeight = async (item, mode: ModeC2CPropertyItem) => {
  const widthSeparator = HEIGHT.padding * 2 + HEIGHT.paddingScreen * 2;
  const titleHeight = await MeasureUtils.measureTextSize({
    fontSize: FONT_DEFAULT,
    fontFamily: FONT_BOLD,
    text: item.postTitle,
    width: SCREEN_SIZE.WIDTH - widthSeparator - HEIGHT.border * 2,
    lineInfoForLine: 2,
  });
  const heightHeader =
    titleHeight.height + HEIGHT.header.margin + HEIGHT.header.address + HEIGHT.padding * 2;
  let itemHeight = HEIGHT.banner + heightHeader + HEIGHT.center + HEIGHT.bottom + HEIGHT.marginItem;
  if (mode === 'saved-post') {
    itemHeight = itemHeight - HEIGHT.bottom;
  }
  return itemHeight;
};

const C2CPropertyItem = ({item, onPress, mode, ...props}: C2CPropertyItemTypes) => {
  switch (mode) {
    case 'your-post':
      return (
        <C2CPropertyItemDefault
          item={item}
          onPress={onPress}
          isShowStatus={true}
          isShowCreatedTime={true}
        />
      );
    case 'saved-post':
      return <C2CPropertyItemDefault item={item} onPress={onPress} {...props} />;
    default:
      throw new Error(mode);
  }
};

const C2CPropertyItemDefault = ({
  item,
  onPress,
  isShowStatus,
  isShowFollow,
  isShowCreatedTime,
  customBtnFollowStyle = {},
}) => {
  const {
    images,
    isFollowed,
    propertyPostId,
    title,
    address,
    price,
    buildingArea,
    direction,
    createdDatetime,
    status,
    statusStyle,
    statusTextStyle,
    C2CSkipComponent = () => null,
  } = item;
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.container}>
      <View style={styles.banner}>
        <ImageProgress
          url={images}
          resizeMode="cover"
          containerStyle={styles.image}
          imageContainerStyle={styles.image}
          imageStyle={styles.image}
        />
        {isShowFollow && (
          <FollowButton
            isProperty={true}
            customIcon={isFollowed ? IMAGES.IC_HEART_FILL : IMAGES.IC_HEART_LINEAR}
            followStrategy={UPDATE_ITEM_STRATEGY.NORMAL}
            isFollowed={isFollowed}
            propertyPostId={propertyPostId}
            customStyle={[styles.btnFollow, customBtnFollowStyle]}
            isBanner={true}
            imageStyle={styles.sizeFollow}
          />
        )}
        {isShowStatus && (
          <TagStatus
            status={status}
            textStatusStyle={{...FONTS.regular, ...statusTextStyle}}
            statusStyle={statusStyle}
            statusPosition={styles.positionStatus}
          />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.txtTitle} numberOfLines={2}>
            {title}
          </Text>
          <SizeBox height={HEIGHT.header.margin} />
          <Text style={styles.txtAddress} numberOfLines={1}>
            {address}
          </Text>
        </View>
        <View style={styles.wrapperCenter}>
          <View style={styles.rowCenter}>
            <Text style={styles.txtPrice}>{price}</Text>
            <Text style={styles.font16}>{`${price ? ' - ' : ''}${buildingArea}`} m2</Text>
          </View>
          <Text style={styles.font16}>{direction}</Text>
        </View>
        {isShowCreatedTime && (
          <View style={styles.wrapperCenter}>
            <View style={styles.rowCenter}>
              <Text style={styles.txtCreatedTime}>
                {translate('propertyPost.createDateTime')}:{' '}
              </Text>
              <Text style={styles.font16}>{createdDatetime}</Text>
            </View>
          </View>
        )}
        <C2CSkipComponent />
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.BORDER_RADIUS_8,
    overflow: 'hidden',
  },
  banner: {
    height: HEIGHT.banner,
  },
  positionStatus: {top: 12, left: 12},
  image: {
    height: '100%',
    width: '100%',
  },
  btnFollow: {
    position: 'absolute',
    top: SIZES.SEPARATOR_12,
    right: SIZES.SEPARATOR_12,
  },
  sizeFollow: {width: 32, height: 32},
  content: {
    borderBottomLeftRadius: SIZES.BORDER_RADIUS_8,
    borderBottomRightRadius: SIZES.BORDER_RADIUS_8,
    borderLeftWidth: HEIGHT.border,
    borderRightWidth: HEIGHT.border,
    borderBottomWidth: HEIGHT.border,
    borderColor: COLORS.NEUTRAL_BORDER,
  },
  header: {padding: HEIGHT.padding},
  txtTitle: {
    ...FONTS.bold,
    fontSize: FONT_DEFAULT,
    color: COLORS.TEXT_DARK_10,
  },
  txtAddress: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_DARK_40,
    lineHeight: HEIGHT.header.address,
  },
  wrapperCenter: {
    flexDirection: 'row',
    borderTopWidth: HEIGHT.border,
    borderColor: COLORS.NEUTRAL_BORDER,
    paddingHorizontal: SIZES.PADDING_12,
    height: HEIGHT.center,
    alignItems: 'center',
  },
  rowCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtPrice: {
    ...FONTS.bold,
    fontSize: FONT_DEFAULT,
    color: COLORS.PRIMARY_B100,
  },
  font16: {
    ...FONTS.regular,
    fontSize: FONT_DEFAULT,
    color: COLORS.TEXT_DARK_10,
  },
  txtCreatedTime: {
    ...FONTS.regular,
    fontSize: FONT_DEFAULT,
    color: COLORS.TEXT_DARK_40,
  },
});
export default C2CPropertyItem;
