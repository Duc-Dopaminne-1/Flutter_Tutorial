import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {List} from 'react-native-paper';

import {TRANSACTION_MODE} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import Avatar from '../../components/Avatar';
import {CustomFollowButton} from '../../components/Button/EyeFollowButton';
import HtmlOverallProject from '../../components/ProjectItem/HtmlOverallProject';
import {getColorProjectStatus} from '../../components/SearchProjectItem/types';
import {SizeBox} from '../../components/SizeBox';
import ImageSlider from '../../components/Slider/ImageSlider';
import {TagStatus} from '../../components/TagStatus';
import TextWithTitle from '../../components/Text/TextWithTitle';
import TextView from '../../components/TextView';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import PropertyType from '../ManagePost/PropertyType';
import styles from './styles';

const contentStyles = StyleSheet.create({
  viewHTML: {
    width: SCREEN_SIZE.WIDTH * 0.6,
    alignItems: 'flex-end',
    marginTop: 2,
  },
});

export const ImageIcon = ({onPress, imageName}) => (
  <TouchableOpacity onPress={onPress} style={styles.iconView}>
    <Image source={imageName} style={styles.iconImage} />
  </TouchableOpacity>
);

const GeneralInfo = ({
  isFollowed,
  startYear = 0,
  projectTypeName,
  images = [],
  projectName = '',
  minPrice = '',
  commission = '',
  investorOwnerLogo = null,
  investorId = '',
  investorCode = '',
  investor = '',
  overallDescription = '',
  projectType = '',
  totalArea = '',
  address,
  needShowMatterport,
  needShowStreetview,
  onPress3D,
  onPressStreetview,
  needShowVideoview,
  onPressVideo,
  onPressInvestor,
  projectStatus,
  projectStatusDescription,
  maxBookingNumber,
  isTesting,
  projectStatusId,
  onToggleFollowStatus,
}) => {
  const isShowStartYear = startYear > 0 && projectTypeName !== PropertyType.land;
  const isBookingPhase = projectStatus === TRANSACTION_MODE.BOOKING;
  const isDepositPhase = projectStatus === TRANSACTION_MODE.DEPOSIT;
  return (
    <>
      <View>
        <ImageSlider
          images={images}
          onPressStreetView={onPressStreetview}
          onPress3D={onPress3D}
          onPressVideo={onPressVideo}
          showStreetView={needShowStreetview}
          show3D={needShowMatterport}
          showVideo={needShowVideoview}
          isTesting={isTesting}
        />
        <CustomFollowButton
          customIcon={isFollowed ? IMAGES.IC_HEART_FILL : IMAGES.IC_HEART_LINEAR}
          isFollowed={isFollowed}
          style={styles.followButton}
          onPress={onToggleFollowStatus}
        />
      </View>
      <SizeBox height={SIZES.SEPARATOR_12} />
      <View style={METRICS.horizontalPadding}>
        <Text style={styles.textProject}>{projectName}</Text>
        <SizeBox height={SIZES.SEPARATOR_8} />
        {!!address && (
          <>
            <View style={[HELPERS.row]}>
              <Text style={styles.textAddress}>{address}</Text>
            </View>
            <SizeBox height={SIZES.SEPARATOR_8} />
          </>
        )}
        {!!projectStatusDescription && (
          <TagStatus
            status={projectStatusDescription}
            statusStyle={getColorProjectStatus(projectStatusId)}
            containerStyle={styles.containerStatus}
            height={20}
            fontSize={12}
          />
        )}
        <View style={styles.viewRowWithBorder}>
          <TextWithTitle
            label={translate(STRINGS.FROM_PRICE)}
            value={minPrice || translate('home.contactPrice')}
            customStyleValue={{...commonStyles.blackTextBold20, color: COLORS.PRIMARY_A100}}
            style={HELPERS.fill}
          />
          <TextWithTitle
            label={translate(STRINGS.COMMISSION)}
            value={commission ? `${commission}` : '--'}
            customStyleValue={{...commonStyles.blackTextBold20, color: COLORS.PRIMARY_B100}}
            style={HELPERS.fill}
          />
        </View>
        {!!(isBookingPhase || isDepositPhase) && (
          <View style={[HELPERS.column, METRICS.verticalMargin]}>
            <Text style={styles.textBookingDescription}>
              {translate(
                isBookingPhase ? 'common.bookingDescription' : 'common.depositDescription',
              )}
            </Text>
            {!!maxBookingNumber && !!isBookingPhase && (
              <Text style={styles.textMaxBooking}>
                {translate('common.maxBookingNumber', {
                  maxBookingNumber,
                })}
              </Text>
            )}
          </View>
        )}
      </View>
      <View style={commonStyles.separatorRow8WithColor} />
      <InvestorSection
        logo={investorOwnerLogo}
        title={investor || 'N/A'}
        onPress={() => onPressInvestor(investorId, investorCode)}
      />
      <View style={commonStyles.separatorRow8WithColor} />
      <View style={METRICS.horizontalPadding}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{translate(STRINGS.BASIC_INFO)}</Text>
          <TextView
            title={`${translate(STRINGS.TYPE)}: `}
            containerStyle={HELPERS.mainSpaceBetween}
            titleStyle={styles.textStateValue}
            value={projectType}
            valueStyle={styles.textState}
          />
          <View style={commonStyles.separatorRow8} />
          <TextView
            title={`${translate(STRINGS.ACREAGE)}: `}
            containerStyle={HELPERS.mainSpaceBetween}
            titleStyle={styles.textStateValue}
            value={totalArea || 'N/A'}
            valueStyle={styles.textState}
          />
          <View style={commonStyles.separatorRow8} />
          {isShowStartYear && (
            <TextView
              title={`${translate('common.startYear')}: `}
              containerStyle={HELPERS.mainSpaceBetween}
              titleStyle={styles.textStateValue}
              value={startYear || 'N/A'}
              valueStyle={styles.textState}
            />
          )}
          <View style={[styles.viewRow, HELPERS.crossStart]}>
            <Text style={[styles.textStateValue]}>{'Quy mô: '}</Text>
            <HtmlOverallProject
              maxHeight={null}
              numberOfLines={null}
              emptyView={<Text style={styles.textState}>{'N/A'}</Text>}
              viewStyle={contentStyles.viewHTML}
              data={overallDescription}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const InvestorSection = ({
  logo = '',
  title = '',
  description = '',
  onPress = () => {},
  avatarSize = 46,
}) => {
  return (
    <List.Item
      title={title}
      description={description}
      titleStyle={styles.investorTitle}
      descriptionStyle={styles.investorDescription}
      style={styles.investorContainer}
      left={props => (
        <View style={styles.investorLeft}>
          <Avatar resizeMode={'contain'} url={logo} size={avatarSize} {...props} />
        </View>
      )}
      right={props => (
        <View style={styles.investorRight}>
          <Image
            {...props}
            style={{tintColor: COLORS.PRIMARY_A100}}
            source={IMAGES.ARROW_RIGHT_LINEAR}
            resizeMode="contain"
          />
        </View>
      )}
      onPress={onPress}
    />
  );
};

export default GeneralInfo;
