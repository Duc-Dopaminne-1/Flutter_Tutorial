import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AutoSizeText} from 'react-native-auto-size-text';

import {ITEM_TYPE, UPDATE_ITEM_STRATEGY} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {small, smallNormal, tiny} from '../assets/theme/metric';
import {SCREEN_SIZE} from '../utils/ImageUtil';
import FollowButton from './Button/FollowButton';
import CustomIconButton from './CustomIconButton';
import ImageProgress from './ImageProgress';
import {MaskView} from './MaskView';
import {TagStatus} from './TagStatus';

const styles = StyleSheet.create({
  image: {
    width: 276,
    height: 212,
    borderRadius: small,
  },
  projectAddress: {color: COLORS.NEUTRAL_WHITE, fontSize: 12, ...FONTS.regular},
  statusContainer: {width: '100%', padding: small},
  circlePrice: {
    width: 79,
    height: 79,
    borderRadius: SIZES.BORDER_RADIUS_100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY_A100,
    position: 'absolute',
    top: -21,
    left: -17,
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  priceText: {color: COLORS.NEUTRAL_WHITE, fontSize: 12},
  price: {
    color: COLORS.NEUTRAL_WHITE,
    ...FONTS.bold,
    width: 40,
    textAlign: 'center',
  },
  maskView: {
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: small,
    flex: 1,
  },
});

export const FavoriteButton = () => {
  return <CustomIconButton style={styles.buttonFavorite} image={IMAGES.IC_BTN_FAVORITE} />;
};

const BannerImageProject = ({
  url,
  isProperty = false,
  itemType = ITEM_TYPE.full,
  status,
  statusStyle = {},
  statusTextStyle = {},
  isHot,
  isShowStatus = true,
  isShowFollowButton = true,
  isFollowed,
  propertyPostId,
  customStyle,
  forRent,
  showForRentBanner,
  isRented,
  isSold,
  projectInfo,
  isTesting,
  width = 0,
  height = 0,
  isBanner = true,
  statusPosition,
  ...otherProps
}) => {
  const customSize = width && height && {width: width, height: height};
  const imageStyle =
    itemType === ITEM_TYPE.full
      ? {width: SCREEN_SIZE.WIDTH - 34, height: 262, borderRadius: small, ...customSize}
      : {...styles.image, ...customSize};
  return (
    <View style={[imageStyle, customStyle]}>
      <ImageProgress
        url={url}
        resizeMode={otherProps?.resizeMode}
        containerStyle={[HELPERS.absolute, imageStyle, customStyle]}
        imageContainerStyle={[HELPERS.absolute, imageStyle, customStyle]}
        imageStyle={imageStyle}
      />
      <MaskView customStyle={styles.maskView}>
        {isShowFollowButton && !isTesting && (
          <FollowButton
            isProperty={isProperty}
            customIcon={isFollowed ? IMAGES.IC_HEART_FILL : IMAGES.IC_HEART_LINEAR}
            followStrategy={UPDATE_ITEM_STRATEGY.NORMAL}
            isFollowed={isFollowed}
            propertyPostId={propertyPostId}
            customStyle={otherProps?.followButtonStyle}
            isBanner={isBanner}
            {...otherProps}
          />
        )}
        {!isProperty && (
          <View style={styles.circlePrice}>
            <View style={styles.priceContainer}>
              {projectInfo?.minPrice ? (
                <>
                  <Text style={styles.priceText}>{translate('common.fromPrice')}</Text>
                  <AutoSizeText numberOfLines={1} fontSize={16} style={styles.price}>
                    {projectInfo?.minPrice?.toLowerCase()}
                  </AutoSizeText>
                </>
              ) : (
                <Text numberOfLines={2} style={[styles.price, {fontSize: smallNormal}]}>
                  {translate('home.contactPrice')}
                </Text>
              )}
            </View>
          </View>
        )}
        {isShowStatus && (
          <TagStatus
            status={status}
            isRented={isRented}
            isSold={isSold}
            isForRent={forRent}
            showForRentBanner={showForRentBanner}
            statusPosition={statusPosition}
            statusStyle={statusStyle}
            textStatusStyle={statusTextStyle}
            isGuaranteed={otherProps?.isGuaranteed}
            height={20}
            fontSize={12}
          />
        )}
        <View style={styles.statusContainer}>
          {projectInfo?.projectName && (
            <Text
              numberOfLines={1}
              style={{...FONTS.bold, marginVertical: tiny, color: COLORS.NEUTRAL_WHITE}}>
              {projectInfo?.projectName}
            </Text>
          )}
          <Text numberOfLines={1} style={styles.projectAddress}>
            {projectInfo?.projectAddress}
          </Text>
        </View>
      </MaskView>
    </View>
  );
};

export default BannerImageProject;
