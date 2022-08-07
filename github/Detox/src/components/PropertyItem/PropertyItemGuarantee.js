import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {PostContractStatus, PostServiceType} from '../../api/graphql/generated/graphql';
import {
  APPROVAL_STATUS,
  APPROVAL_STATUS_ID,
  getPropertyPostStatusStyle,
  getPropertyPostTextColor,
  ITEM_TYPE,
  MAP_RANK,
  NOT_ANS,
} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {FONT_BOLD, FONT_REGULAR} from '../../assets/fonts';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {medium, mediumPlus, METRICS, normal, small, smallNormal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import {useContactInfo} from '../../hooks';
import {extractAddressData} from '../../utils/DataProcessUtil';
import {
  getPropertyPostApprovalStatusDescriptionById,
  getPropertyPostApprovalStatusNameById,
} from '../../utils/GetMasterData';
import {
  getFullSizeImageDimension,
  getSmallSizeImageDimension,
  SCREEN_SIZE,
} from '../../utils/ImageUtil';
import MeasureUtils from '../../utils/MeasureUtils';
import {getTransactionDateTimeString} from '../../utils/TimerCommon';
import Avatar from '../Avatar';
import BannerImageProject from '../BannerImageProject';
import CustomBottomButton from '../Button/CustomBottomButton';
import CustomIconButton from '../CustomIconButton';
import RatingComponent from '../Rating/RatingComponent';
import TextView from '../TextView';
import InfoProperty from './InfoProperty';
import InfoPropertyCustom from './InfoPropertyCustom';

const fullSize = getFullSizeImageDimension();
const smallSize = getSmallSizeImageDimension();
const imageHeight = fullSize.height;
const margin = normal + smallNormal * 3;

const FONT_SIZE_ADDRESS = 13;
const ICON_MEMBER_SIZE = 42;
const CONTACT_ICON_SIZE = 28;

const fontSizeTitle = 18;
const lintHeightTitle = 26;
const minHeightTitle = fontSizeTitle * 2 + 16;
const styles = StyleSheet.create({
  containerSmall: {
    margin: 2,
    flexWrap: 'wrap',
    width: smallSize.width,
    borderRadius: SIZES.BORDER_RADIUS_8,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  contentStyle: {
    ...HELPERS.fullWidth,
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
    ...HELPERS.fill,
    ...FONTS.semiBold,
    fontSize: fontSizeTitle,
    lineHeight: lintHeightTitle,
    color: COLORS.TEXT_DARK_10,
  },
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
  labelText: {
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.NEUTRAL_WHITE,
  },
  valueText: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.NEUTRAL_WHITE,
  },
  imageContainer: {
    borderRadius: small,
    overflow: 'hidden',
  },
  propertyCodeContainer: {
    ...HELPERS.row,
    ...METRICS.smallHorizontalPadding,
    ...METRICS.smallMarginBottom,
    width: '80%',
    position: 'absolute',
    bottom: 0,
  },
  priceCell: {minWidth: 60, ...METRICS.marginRight},
  commissionCell: {
    minWidth: 56,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.NEUTRAL_WHITE,
    ...METRICS.marginRight,
    ...METRICS.paddingLeft,
  },
  propertyCodeCell: {
    minWidth: 90,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.NEUTRAL_WHITE,
    ...METRICS.paddingLeft,
  },
  separatorColumn: {
    marginLeft: 20,
    marginRight: normal,
    height: 18,
    width: 1,
    backgroundColor: COLORS.GREY_F0,
  },
  rowHeightDefault: {
    height: 18,
  },
  customFollowButton: {right: smallNormal, width: 24},
  imageCountContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    borderRadius: 30,
    backgroundColor: COLORS.WHITE_OPACITY_07,
    ...HELPERS.row,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  iconImageCount: {
    height: 16,
    width: 16,
    marginRight: 4,
  },
  outlineIconGuaranteed: {alignSelf: 'flex-start', ...METRICS.tinyMarginTop},
  price: {
    ...FONTS.fontSize14,
    ...FONTS.bold,
    color: COLORS.PRIMARY_A100,
  },
  commission: {
    ...FONTS.fontSize14,
    ...FONTS.bold,
    color: COLORS.PRIMARY_B100,
    alignSelf: 'flex-end',
  },
});

export const getGuaranteedStatusStyle = ({
  item,
  masterData,
  isStatusText = false,
  isForRent = false, // isRental search
}) => {
  const postInfo = isForRent ? item?.searchPropertyPostInfoDto : item;

  const statusName = getPropertyPostApprovalStatusNameById(
    masterData,
    postInfo.propertyPostApprovalStatusId,
  );
  const getStatusText = () => {
    let statusText = getPropertyPostApprovalStatusDescriptionById(
      masterData,
      postInfo?.propertyPostApprovalStatusId,
    );
    const hideTagRent =
      statusName === APPROVAL_STATUS.CLOSE ||
      statusName === APPROVAL_STATUS.SOLD ||
      postInfo?.isRented ||
      postInfo?.propertyPostForRentDto?.isRented;

    if (isForRent && postInfo?.forRent && postInfo?.isRented) {
      statusText = translate('propertyPost.isRented');
    }
    return {
      showForRentBanner: !hideTagRent,
      status: statusText,
    };
  };
  const statusText = isStatusText && getStatusText();

  if (postInfo?.forRent) {
    const propertyIsRented = postInfo?.isRented;
    if (propertyIsRented) {
      return {
        statusStyle: {backgroundColor: COLORS.GREEN_EE},
        statusTextStyle: {color: COLORS.GREEN_60},
        ...statusText,
      };
    }
  }

  const backgroundColor = getPropertyPostStatusStyle(statusName);
  const color = getPropertyPostTextColor(statusName);
  return {
    statusStyle: backgroundColor,
    statusTextStyle: color,
    ...statusText,
  };
};

/**
 * Get height of item base on data
 * @param {*} item data item
 * @param {*} isShowBroker user info and call email component
 * @param {*} isCreatedUser created by current user id
 * @returns height of item
 */
export const ItemHeight = async ({
  item,
  isShowBroker = true,
  isCreatedUser = false,
  showOutline = false,
  showCrawler,
}) => {
  const titleSize = await MeasureUtils.measureTextSize({
    fontSize: fontSizeTitle,
    fontFamily: FONT_BOLD,
    text: item?.postTitle ?? '',
    width: SCREEN_SIZE.WIDTH - 48,
    lineInfoForLine: 2,
  });

  const address = extractAddressData(item?.propertyAddress);
  const addressSize = await MeasureUtils.measureTextSize({
    fontSize: 13,
    fontFamily: FONT_REGULAR,
    text: address,
    width: SCREEN_SIZE.WIDTH - 48,
    lineInfoForLine: 1,
  });

  const isRequestedUpdate = item?.propertyPostApprovalStatusId === APPROVAL_STATUS_ID.REQUEST;
  const isRejected = item?.propertyPostApprovalStatusId === APPROVAL_STATUS_ID.REJECTED;
  const brokenSize = isShowBroker ? 70 : 0;
  const crawlerSize = showCrawler ? 100 : 0;
  const outlineSize = showOutline ? 28 : 24;
  const requestedUpdatingReason =
    item?.requestedUpdatingReason && isRequestedUpdate ? mediumPlus : 0;
  const rejectedReason = item?.rejectedReason && isRejected ? mediumPlus : 0;
  const guaranteedPackageEndTime = item?.guaranteedPackageEndTime ? mediumPlus : 0;
  let postServiceType = 0;
  if (!isEmpty(item?.postServiceType) && item?.postServiceType === PostServiceType.Guaranteed) {
    postServiceType = mediumPlus;
  }
  const guaranteedHeight = isCreatedUser
    ? rejectedReason + requestedUpdatingReason + guaranteedPackageEndTime + postServiceType
    : 0;

  const heightItem =
    imageHeight +
    margin +
    titleSize.height +
    addressSize.height +
    brokenSize +
    guaranteedHeight +
    outlineSize +
    crawlerSize;

  return heightItem;
};

const checkGuaranteedProperty = (contractStatus, packageEndTime, postServiceType) => {
  if (postServiceType && postServiceType === PostServiceType.Guaranteed) {
    if (isEmpty(contractStatus) || !packageEndTime) return false;
    return contractStatus === PostContractStatus.Haspaid && moment().isBefore(packageEndTime);
  }
  return false;
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

const PriceCommissionCodeView = ({
  price,
  commission,
  forRent = false,
  propertyCode,
  showPriceDetailForRent,
}) => {
  const priceTitle =
    forRent && showPriceDetailForRent
      ? translate('common.rent') + '/' + translate('common.month')
      : translate('common.sell');
  return (
    <>
      <View style={styles.propertyCodeContainer}>
        <View style={styles.priceCell}>
          <View>
            <Text style={styles.labelText}>{priceTitle}:</Text>
            <Text numberOfLines={1} style={styles.valueText}>
              {price?.toLowerCase()}
            </Text>
          </View>
        </View>
        <View style={styles.commissionCell}>
          <View>
            <Text style={styles.labelText}>{translate(STRINGS.COMMISSION)}:</Text>
            <Text numberOfLines={1} style={styles.valueText}>
              {/* parse commission to String */}
              {String(commission).toLowerCase()}
            </Text>
          </View>
        </View>
        {!!propertyCode && (
          <View style={styles.propertyCodeCell}>
            <Text style={styles.labelText}>{translate('common.mtd')}:</Text>
            <Text numberOfLines={1} style={styles.valueText}>
              {propertyCode}
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

const PriceCommissionView = ({price, buildingArea, commission}) => {
  return (
    <>
      <TextView
        title={`${price ?? '--'} - ${buildingArea ?? '--'}`}
        titleStyle={styles.price}
        customRightComponent={
          <View style={[HELPERS.fill, HELPERS.crossEnd]}>
            {!!commission && (
              <Text style={styles.commission}>{`${translate(
                STRINGS.COMMISSION,
              )} ${commission}`}</Text>
            )}
          </View>
        }
        containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      />
      <View style={commonStyles.separatorRow8} />
    </>
  );
};

/**
 * Property post item view with new version in 2021
 * Price, commission in banner picture and update status colors
 * @version PRIMARY_A100: '#FF951F'
 */
const PropertyItemGuarantee = props => {
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
    requestedUpdatingReason,
    rejectedReason,
    guaranteedPackageEndTime,
    contractStatus,
    postServiceType,
    isCreatedUser,
    contractStatusValue,
    isGuaranteed,
    imagesSize,
    showOutline,
    isRequestedUpdate,
    isRejected,
    crawlerProps,
    containerStyle,
    isTesting,
    onFollowSuccess,
  } = props;
  // property crawler props
  const {showCrawler, contactInfo, onRemove = () => {}, onPublic = () => {}} = crawlerProps ?? {};

  const itemStyle = showBrokenInfo
    ? [styles.containerSmall, {...commonStyles.shadowApp}]
    : [
        styles.containerSmall,
        commonStyles.shadowApp,
        {borderWidth: SIZES.BORDER_WIDTH_1, borderColor: COLORS.SEPARATOR_LINE},
      ];
  let isFullItem = style;
  let customImageStyle = null;
  if (itemType === ITEM_TYPE.full) {
    isFullItem = {width: fullSize.width};
  } else if (itemType === ITEM_TYPE.fullWithPadding) {
    isFullItem = {width: fullSize.width - small};
    customImageStyle = isFullItem;
  }

  const acreage = props?.buildingArea ?? 0;
  const acreageText = MeasureUtils.getSquareMeterText(acreage);
  const {callPhone, sendEmail} = useContactInfo(props.brokenPhone, props.brokenEmail);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[itemStyle, isFullItem, containerStyle]}
      disabled={onPress ? false : true}
      onPress={() => onPress(props)}>
      {showImageBanner && (
        <View style={styles.imageContainer}>
          <BannerImageProject
            customStyle={customImageStyle}
            actions={actions}
            isShowStatus={isShowStatus} // TODO: ẩn cho tin lưu trữ !isPrivate
            isProperty={true}
            status={status} // status text
            statusStyle={statusStyle} // custom status container style
            statusTextStyle={statusTextStyle} // custom status text style
            isFollowed={props.isFollowed}
            propertyPostId={props.propertyPostId}
            itemType={itemType}
            isShowFollowButton={isShowFollowButton}
            url={props.images}
            forRent={forRent}
            showForRentBanner={showForRentBanner}
            isRented={isRented}
            isSold={isSold}
            height={195}
            width={SCREEN_SIZE.WIDTH - 34}
            showLinearCover={!showOutline} // change image background with linear colors
            isHeartIcon={true} // change follow icon = heart icon
            followButtonStyle={styles.customFollowButton} // custom style button follow
            isTesting={isTesting}
            isGuaranteed={
              !isCreatedUser &&
              (isGuaranteed ||
                checkGuaranteedProperty(
                  contractStatusValue,
                  guaranteedPackageEndTime,
                  postServiceType,
                ))
            } // change marker icon guaranteed on status banner
            onFollowSuccess={onFollowSuccess}
          />
          {imagesSize > 0 && showOutline && (
            <View style={styles.imageCountContainer}>
              <Image source={IMAGES.IC_IMAGE} style={styles.iconImageCount} />
              <Text>{imagesSize}</Text>
            </View>
          )}
          {showOutline || (
            <PriceCommissionCodeView
              price={forRent && showPriceDetailForRent ? rentPrice : price}
              commission={forRent && showPriceDetailForRent ? rentCommission : commission}
              forRent={forRent}
              forSale={forSale}
              showPriceDetailForRent={showPriceDetailForRent}
              propertyCode={propertyCode}
            />
          )}
        </View>
      )}
      <View style={[styles.contentStyle, contentStyle]}>
        <View style={commonStyles.separatorRow12} />
        <View style={[HELPERS.row, HELPERS.fullWidth]}>
          {!isCreatedUser &&
            (isGuaranteed ||
              checkGuaranteedProperty(
                contractStatusValue,
                guaranteedPackageEndTime,
                postServiceType,
              )) && (
              <CustomIconButton
                style={styles.outlineIconGuaranteed}
                disabled={true}
                iconColor={COLORS.GREEN_BASIC}
                iconName="shield-checkmark"
                customImageSize={normal}
              />
            )}
          <Text
            numberOfLines={2}
            style={[styles.title, isHorizontal ? {minHeight: minHeightTitle} : {}]}>
            {props.title}
          </Text>
        </View>
        <Text numberOfLines={1} style={styles.address}>{`${props.address}`}</Text>
        {showOutline && (
          <PriceCommissionView buildingArea={acreageText} price={price} commission={commission} />
        )}
        {showOutline || (
          <InfoProperty
            buildingArea={props.buildingArea}
            direction={props.direction}
            numberOfBathrooms={props.numberOfBathrooms}
            numberOfBedrooms={props.numberOfBedrooms}
          />
        )}
        {showOutline && (
          <InfoPropertyCustom
            direction={props.direction}
            numberOfBathrooms={props.numberOfBathrooms}
            numberOfBedrooms={props.numberOfBedrooms}
            acreage={acreageText}
            isCrawler={showCrawler}
          />
        )}
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
        {showCrawler && (
          <>
            <Text style={[commonStyles.blackText14, METRICS.marginTop]}>
              {`${translate(STRINGS.CONTACT)}: `}
              <Text style={[commonStyles.blackTextBold14, {color: COLORS.PRIMARY_B100}]}>
                {`${contactInfo?.fullname ?? NOT_ANS} - ${contactInfo?.phoneNumber ?? NOT_ANS}`}
              </Text>
            </Text>
            <CustomBottomButton
              leftTitle={translate('common.deleteFromList')}
              rightTitle={translate(STRINGS.UPLOAD_POST)}
              hideShadow
              containerStyle={[HELPERS.row, METRICS.marginTop, {height: medium}]}
              leftButtonStyle={METRICS.tinyVerticalPadding}
              rightButtonStyle={METRICS.tinyVerticalPadding}
              onPressLeftButton={() => onRemove(props.propertyPostId)}
              onPressRightButton={() => onPublic(props.propertyPostId)}
            />
          </>
        )}
        {isCreatedUser && isRequestedUpdate && !!requestedUpdatingReason && (
          <>
            <View style={[METRICS.smallVerticalMargin, HELPERS.fill, commonStyles.separatorLine]} />
            <Text numberOfLines={1} style={[commonStyles.errorText, styles.rowHeightDefault]}>
              {requestedUpdatingReason}
            </Text>
          </>
        )}
        {isCreatedUser && isRejected && !!rejectedReason && (
          <>
            <View style={[METRICS.smallVerticalMargin, HELPERS.fill, commonStyles.separatorLine]} />
            <Text numberOfLines={1} style={[commonStyles.errorText, styles.rowHeightDefault]}>
              {rejectedReason}
            </Text>
          </>
        )}
        {isCreatedUser && postServiceType === PostServiceType.Guaranteed && (
          <>
            <View style={[METRICS.smallVerticalMargin, HELPERS.fill, commonStyles.separatorLine]} />
            <View style={HELPERS.rowCross}>
              <View style={HELPERS.rowCross}>
                <CustomIconButton
                  disabled={true}
                  iconColor={COLORS.GREEN_60}
                  iconName="shield-checkmark"
                  customImageSize={normal}
                />
                <Text style={[commonStyles.blackText12, METRICS.tinyMarginStart]}>
                  {translate('propertyPost.guaranteedProperty')}
                </Text>
              </View>
              {!!contractStatus && (
                <View style={[HELPERS.rowCross, styles.rowHeightDefault]}>
                  <View style={styles.separatorColumn} />
                  <Text style={commonStyles.blackText12}>{contractStatus}</Text>
                </View>
              )}
            </View>
          </>
        )}
        {isCreatedUser && guaranteedPackageEndTime && (
          <>
            <View style={[METRICS.smallVerticalMargin, HELPERS.fill, commonStyles.separatorLine]} />
            <Text numberOfLines={1} style={[commonStyles.grayText12, styles.rowHeightDefault]}>
              {translate(STRINGS.EXPIRED_DATE)}:
              <Text style={[commonStyles.blackText12, METRICS.tinyMarginStart]}>
                {getTransactionDateTimeString(guaranteedPackageEndTime)}
              </Text>
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(PropertyItemGuarantee, (props, nextProps) => {
  if (props?.isFollowed !== nextProps?.isFollowed) {
    return false;
  }
  return true;
});
