import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {ITEM_TYPE} from '../assets/constants';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {small} from '../assets/theme/metric';
import {getImageSize, getSmallSizeImageDimension, SCREEN_SIZE} from '../utils/ImageUtil';
import FollowButton from './Button/FollowButton';
import ImageProgress from './ImageProgress';
import {TagStatus} from './TagStatus';

const fullSize = getImageSize(SCREEN_SIZE.WIDTH - 32, 2 / 1);
const smallSize = getSmallSizeImageDimension();
const commissionMinWidth = 80;
const STATUS_FONT_SIZE = 12;
const styles = StyleSheet.create({
  image: {
    width: fullSize.WIDTH,
    height: fullSize.HEIGHT,
    backgroundColor: COLORS.TEXT_DARK_40,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  imageSmall: {
    ...smallSize,
    backgroundColor: COLORS.TEXT_DARK_40,
    borderRadius: 4,
  },
  priceContainer: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    zIndex: 1,
    minWidth: 100,
    flexDirection: 'row',
  },
  priceTextContainer: {
    backgroundColor: COLORS.GRAY_06,
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 8,

    borderTopLeftRadius: 5,
    minWidth: commissionMinWidth,
    justifyContent: 'center',
  },
  priceText: {
    fontSize: 14,
    ...FONTS.bold,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'center',
  },
  containerVipBanner: {
    ...HELPERS.row,
    position: 'absolute',
    zIndex: 1,
    backgroundColor: COLORS.TEXT_DARK_10,
    padding: small,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 4,
    top: 0,
    right: 0,
  },
  vipText: {
    ...FONTS.regular,
    fontSize: 10,
    color: COLORS.GOLD,
    marginHorizontal: small,
  },
  followButton: {bottom: 12, right: 12, position: 'absolute'},
});

const VipBanner = () => {
  return (
    <View style={styles.containerVipBanner}>
      <MaterialCommunityIcons size={16} name="crown" color={COLORS.GOLD} />
      <Text style={styles.vipText}>VIP</Text>
    </View>
  );
};

const FollowSaleBanner = ({
  url,
  followerCount,
  itemType,
  status,
  isVip,
  isShowStatus = true,
  isShowFollowButton = true,
  ...otherProps
}) => {
  const imageStyle = itemType === ITEM_TYPE.small ? styles.imageSmall : styles.image;
  const hideFollower = true;
  return (
    <View style={imageStyle}>
      <ImageProgress
        url={url}
        containerStyle={[imageStyle, HELPERS.absolute]}
        imageContainerStyle={[imageStyle, HELPERS.absolute]}
        imageStyle={imageStyle}
      />
      {isShowStatus && <TagStatus textStatusStyle={{fontSize: STATUS_FONT_SIZE}} status={status} />}
      {isVip && <VipBanner />}
      {hideFollower ? null : (
        <View style={styles.priceContainer}>
          <View style={styles.priceTextContainer}>
            <Text numberOfLines={1} style={styles.priceText}>
              {followerCount} lượt theo dõi
            </Text>
          </View>
        </View>
      )}
      {isShowFollowButton && (
        <FollowButton
          isHomePage={true}
          customStyle={styles.followButton}
          followerCount={followerCount}
          {...otherProps}
        />
      )}
    </View>
  );
};

export default FollowSaleBanner;
