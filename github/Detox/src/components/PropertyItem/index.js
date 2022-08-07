import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View, ViewPropTypes} from 'react-native';

import {ITEM_TYPE, MAP_RANK} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {FONT_BOLD} from '../../assets/fonts';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, small} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import {useContactInfo} from '../../hooks';
import {defaultProperty, PropertyItemType} from '../../screens/Home/TopenerOfMonth/types';
import {getFullSizeImageDimension, getSmallSizeImageDimension} from '../../utils/ImageUtil';
import MeasureUtils from '../../utils/MeasureUtils';
import Avatar from '../Avatar';
import BannerImageProject from '../BannerImageProject';
import CustomIconButton from '../CustomIconButton';
import InterestedButton from '../InterestedButton';
import RatingComponent from '../Rating/RatingComponent';
import InfoProperty from './InfoProperty';

const fullSize = getFullSizeImageDimension();
const smallSize = getSmallSizeImageDimension();

const FONT_SIZE_ADDRESS = 13;
const ICON_MEMBER_SIZE = 42;
const CONTACT_ICON_SIZE = 32;

const fontSizeTitle = 18;
const lintHeightTitle = 26;
const minHeightTitle = fontSizeTitle * 2 + 16;
const styles = StyleSheet.create({
  containerSmall: {
    flexWrap: 'wrap',
    width: smallSize.width,
    borderRadius: SIZES.BORDER_RADIUS_8,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    margin: 2,
  },
  contentStyle: {
    paddingBottom: 12,
    ...METRICS.smallHorizontalPadding,
  },
  address: {
    ...FONTS.regular,
    fontSize: FONT_SIZE_ADDRESS,
    color: COLORS.GREY_82,
    marginTop: 4,
    marginBottom: small,
    marginEnd: small,
  },
  title: {
    ...FONTS.semiBold,
    fontSize: fontSizeTitle,
    lineHeight: lintHeightTitle,
  },
  title90Percent: {
    width: '90%',
  },
  containerTitle: {
    ...HELPERS.rowSpaceBetween,
    width: '100%',
  },
  viewCommission: {
    flexDirection: 'row',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: COLORS.SELECTED_AREA,
  },
  flexText: {flex: 1},
  viewNameAgent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    marginLeft: 10,
  },
  brokenContainer: {
    ...HELPERS.row,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.SEPARATOR_LINE,
    alignItems: 'center',
    paddingTop: 12,
  },
  iconRankBroker: {
    width: 20,
    height: 20,
    position: 'absolute',
    bottom: -2,
    left: 25,
  },
  textGrayStyle: {
    ...FONTS.regular,
    flex: 1,
    fontSize: 12,
    color: COLORS.BRAND_GREY,
  },
  propertyCodeContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  propertyCodeText: {
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.PRIMARY_A100,
  },
});

export const ItemHeight = async ({item, isShowBroker = true}) => {
  const titleSize = await MeasureUtils.measureTextSize({
    fontSize: fontSizeTitle,
    fontFamily: FONT_BOLD,
    text: item?.postTitle || item?.propertyName,
    width: fullSize.width - 16,
    lineInfoForLine: 2,
  });
  const brokenSize = isShowBroker ? 70 : 0;
  const propertyCodeSize = item.propertyCode ? 34 : 0;
  const totalSize = titleSize.height;
  return 170 + smallSize.height + totalSize + brokenSize + propertyCodeSize;
};

export const ViewBrokerInfo = ({
  rating,
  name,
  rank,
  avatar,
  onPressPhone,
  onPressEmail,
  isAgent,
}) => {
  const iconRank = MAP_RANK[rank]?.icon;
  return (
    <View style={styles.brokenContainer}>
      <Avatar resizeMode={'contain'} url={avatar} size={ICON_MEMBER_SIZE} />
      {iconRank && isAgent && <Image style={styles.iconRankBroker} source={IMAGES[iconRank]} />}
      <View style={styles.viewNameAgent}>
        <Text style={{...FONTS.bold}} numberOfLines={1}>
          {name}
        </Text>
        {isAgent && (
          <RatingComponent
            showRatingText
            backgroundColor={COLORS.NEUTRAL_WHITE}
            imageSize={14}
            rateNumber={rating}
          />
        )}
      </View>
      <CustomIconButton
        onPress={onPressPhone}
        style={{marginEnd: small}}
        imageStyle={{width: CONTACT_ICON_SIZE, height: CONTACT_ICON_SIZE}}
        image={IMAGES.IC_CONTACT_PHONE}
      />
      <CustomIconButton
        onPress={onPressEmail}
        imageStyle={{width: CONTACT_ICON_SIZE, height: CONTACT_ICON_SIZE}}
        style={{...METRICS.horizontalMargin}}
        image={IMAGES.IC_CONTACT_EMAIL}
      />
    </View>
  );
};

const CommissionView = ({
  price,
  commission,
  requestMode,
  forRent = false,
  showPriceDetailForRent = false,
}) => {
  const textColorStyle = requestMode ? styles.textGrayStyle : styles.flexText;
  const colorText = requestMode ? COLORS.ORANGE_3B : COLORS.GOLD;
  const priceTitle =
    translate(STRINGS.PRICE) +
    ' ' +
    (forRent && showPriceDetailForRent
      ? translate('common.rent').toLowerCase()
      : translate('common.sell').toLowerCase());
  const priceDescription =
    forRent && showPriceDetailForRent ? '/' + translate('common.month').toLowerCase() : '';
  return (
    <View style={styles.viewCommission}>
      <Text style={textColorStyle}>
        {priceTitle}
        {': '} <Text style={{...FONTS.bold, color: COLORS.RED_57}}>{price + priceDescription}</Text>
      </Text>
      <Text style={textColorStyle}>
        {translate(STRINGS.COMMISSION)}:{' '}
        <Text style={{...FONTS.bold, color: colorText}}>{commission}</Text>
      </Text>
    </View>
  );
};

const PropertyItem = (props: PropertyItemType) => {
  const {
    style,
    contentStyle,
    onPress,
    actions,
    showImageBanner = true,
    showBrokenInfo = true,
    isShowStatus = false,
    isHorizontal = false,
    status,
    statusStyle = {},
    statusTextStyle = {},
    isShowFollowButton = true,
    itemType = ITEM_TYPE.small,
    buyRequestMode = false,
    onPressFavorite,
    canBeInterested = false,
    forRent = false,
    forSale = false,
    propertyCode = '',
    price,
    commission,
    rentCommission,
    rentPrice,
    showForRentBanner,
    showPriceDetailForRent,
    isRented,
    isSold,
  } = props;
  const textColorStyle = buyRequestMode ? {color: COLORS.BRAND_GREY} : {};
  const itemStyle = showBrokenInfo
    ? [styles.containerSmall, {...commonStyles.shadowApp}]
    : [
        styles.containerSmall,
        {borderWidth: SIZES.BORDER_WIDTH_1, borderColor: COLORS.SEPARATOR_LINE},
      ];
  const type = itemType;
  const isFullItem = itemType === ITEM_TYPE.full ? {width: fullSize.width} : style;
  const {callPhone, sendEmail} = useContactInfo(props.brokenPhone, props.brokenEmail);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[itemStyle, isFullItem]}
      disabled={onPress ? false : true}
      onPress={() => onPress(props)}>
      {showImageBanner && (
        <View>
          <BannerImageProject
            actions={actions}
            isShowStatus={isShowStatus} // TODO: ẩn cho tin lưu trữ !isPrivate
            isProperty={true}
            status={status}
            statusStyle={statusStyle}
            statusTextStyle={statusTextStyle}
            isFollowed={props.isFollowed}
            propertyPostId={props.propertyPostId}
            itemType={type}
            isShowFollowButton={isShowFollowButton}
            url={props.images}
            forRent={forRent}
            showForRentBanner={showForRentBanner}
            isRented={isRented}
            isSold={isSold}
          />
        </View>
      )}
      <View style={[styles.contentStyle, contentStyle]}>
        <View style={commonStyles.separatorRow12} />
        {!!propertyCode && !buyRequestMode && (
          <>
            <View style={styles.propertyCodeContainer}>
              <Text style={styles.propertyCodeText}>{propertyCode}</Text>
            </View>
            <View style={commonStyles.separatorRow8} />
          </>
        )}
        {buyRequestMode || (
          <Text
            numberOfLines={2}
            style={[styles.title, isHorizontal ? {minHeight: minHeightTitle} : {}]}>
            {props.title}
          </Text>
        )}
        {buyRequestMode && (
          <View
            style={[styles.containerTitle, isHorizontal ? {minHeight: lintHeightTitle * 2} : {}]}>
            <Text
              numberOfLines={2}
              style={[
                styles.title,
                isHorizontal ? {minHeight: minHeightTitle} : {},
                styles.title90Percent,
              ]}>
              {props.title}
            </Text>
            <InterestedButton
              disabled={!canBeInterested}
              onPress={onPressFavorite}
              isInterested={props.isInterested}
            />
          </View>
        )}
        <Text numberOfLines={1} style={[styles.address, textColorStyle]}>{`${props.address}`}</Text>

        {buyRequestMode && (
          <View style={HELPERS.fillRow}>
            <Text numberOfLines={1} style={[styles.address, textColorStyle]}>
              {`${translate(STRINGS.PROPERTY_CODE_DESC)}: `}
            </Text>
            <Text numberOfLines={1} style={[styles.address, textColorStyle]}>
              {`${props.propertyCode}`}
            </Text>
          </View>
        )}
        <InfoProperty
          buildingArea={props.buildingArea}
          direction={props.direction}
          numberOfBathrooms={props.numberOfBathrooms}
          numberOfBedrooms={props.numberOfBedrooms}
        />
        <CommissionView
          price={forRent && showPriceDetailForRent ? rentPrice : price}
          commission={forRent && showPriceDetailForRent ? rentCommission : commission}
          requestMode={buyRequestMode}
          forRent={forRent}
          forSale={forSale}
          showPriceDetailForRent={showPriceDetailForRent}
        />
        {showBrokenInfo && (
          <ViewBrokerInfo
            onPressPhone={callPhone}
            onPressEmail={sendEmail}
            isAgent={props.isAgent}
            rank={props.brokenRank}
            phone={props.brokenPhone}
            rating={props.brokenRating}
            name={props.brokenName}
            email={props.brokenEmail}
            avatar={props.brokenAvatar}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

PropertyItem.propTypes = {
  style: ViewPropTypes.style,
};

PropertyItem.defaultProps = defaultProperty;

export default PropertyItem;
