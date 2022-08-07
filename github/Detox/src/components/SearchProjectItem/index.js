import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ViewPropTypes} from 'react-native';

import {ITEM_TYPE, ONE_LINE_TEXT, UPDATE_ITEM_STRATEGY} from '../../assets/constants';
import {FONT_BOLD} from '../../assets/fonts';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {METRICS, normal, small} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import {getFullSizeImageDimension, getSmallSizeImageDimension} from '../../utils/ImageUtil';
import MeasureUtils from '../../utils/MeasureUtils';
import FollowSaleBanner from '../FollowSaleBanner';
import {InvestorOwnerView} from '../ProjectItem';
import HtmlOverallProject from '../ProjectItem/HtmlOverallProject';
import {defaultProjectSearch, SearchProjectProps} from './types';

const TITLE_MAX_LINE = 1;
const ADDRESS_MAX_LINE = 1;
const fullSize = getFullSizeImageDimension();
const smallSize = getSmallSizeImageDimension();
const styles = StyleSheet.create({
  title: {
    ...FONTS.bold,
    fontSize: 18,
    marginBottom: small,
    color: COLORS.TEXT_DARK_10,
  },
  address: {
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.GREY_82,
  },
  viewAddress: {
    flexDirection: 'row',
    flex: 1,
    paddingBottom: small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_LINE,
  },
  containerStyle: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: 12,
    paddingBottom: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  viewMoreInfo: {
    paddingTop: 12,
    flexDirection: 'row',
    width: '100%',
  },
  textInfo: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  line: {height: 0.5, backgroundColor: COLORS.SEPARATOR_LINE, marginTop: 12, marginBottom: small},
});

export const FullSizeHeight = async () => {
  const titleSize = await MeasureUtils.measureTextSize({
    text: ONE_LINE_TEXT,
    fontSize: 18,
    fontFamily: FONT_BOLD,
    width: fullSize.width,
    lineInfoForLine: TITLE_MAX_LINE,
  });
  const addressHeight = 36;
  const investorOwnerHeight = 18;
  const titleSizeHeight = titleSize.height;

  const infoProjectHeight = 35;

  const result =
    fullSize.height +
    titleSizeHeight +
    addressHeight +
    investorOwnerHeight +
    normal +
    small * 3 +
    normal * 5 +
    infoProjectHeight;
  return result;
};

const TextInfo = ({value, text, isTop, customStyle}) => {
  const viewTopInfo = isTop && {flexDirection: 'row'};
  const numberStyle = {color: COLORS.BRAND_GREY, ...FONTS.regular};
  return (
    <View style={[styles.textInfo, viewTopInfo]}>
      <Text style={numberStyle}>{text}: </Text>
      <Text style={[{...FONTS.regular, color: COLORS.TEXT_DARK_10}, customStyle]}>
        {value || 'N/A'}
      </Text>
    </View>
  );
};

const RenderInfoProject = ({
  commissionRates,
  minPrice,
  overallDescription,
  totalArea,
  startYear,
}) => {
  const customStyle = [{...FONTS.bold, fontSize: 15}];

  return (
    <>
      <View style={styles.viewMoreInfo}>
        <TextInfo
          customStyle={[customStyle, {color: COLORS.RED_3D}]}
          value={minPrice}
          isBorder={true}
          text={'Giá từ'}
        />
        <TextInfo
          customStyle={[customStyle, {color: COLORS.ORANGE_3B}]}
          value={commissionRates}
          text={'Hoa hồng'}
        />
      </View>
      <View style={styles.viewMoreInfo}>
        <TextInfo
          customStyle={[customStyle]}
          value={totalArea || 'N/A'}
          isBorder={true}
          text={'Diện tích'}
        />
        <TextInfo customStyle={[customStyle]} value={startYear || 'N/A'} text={'Năm khởi công'} />
      </View>
      <View style={styles.line} />
      <HtmlOverallProject data={overallDescription} />
    </>
  );
};

const SearchProjectItem = (props: SearchProjectProps) => {
  const {
    item,
    itemType,
    containerStyle,
    onPress,
    actions,
    isFollowCountVisible = false,
    isShowStatus = true,
    unfollowStrategy = UPDATE_ITEM_STRATEGY.NORMAL,
    followStrategy = UPDATE_ITEM_STRATEGY.NORMAL,
    isShowFollowButton = true,
    onFollowSuccess,
  } = props;
  const container =
    itemType === ITEM_TYPE.small
      ? {width: smallSize.width}
      : {width: fullSize.width, ...commonStyles.shadowApp};
  return (
    <TouchableOpacity
      style={[container, containerStyle]}
      disabled={onPress ? false : true}
      onPress={() => onPress(item)}>
      <FollowSaleBanner
        unfollowStrategy={unfollowStrategy}
        followStrategy={followStrategy}
        actions={actions}
        isShowFollowButton={isShowFollowButton}
        projectId={item.projectId}
        itemType={itemType}
        url={item.featurePhotos}
        price={item.minPrice}
        followerCount={item.followerCount}
        isFollowCountVisible={isFollowCountVisible}
        status={item.projectStatusName}
        isFollowed={item.isFollowed}
        isShowStatus={isShowStatus}
        onFollowSuccess={onFollowSuccess}
      />
      <View style={styles.containerStyle}>
        <InvestorOwnerView
          customStyle={{...METRICS.resetPadding, marginBottom: small}}
          logoStyle={METRICS.resetMargin}
          logo={item.investorOwnerLogo}
          name={item.investorOwnerName}
        />
        <Text numberOfLines={TITLE_MAX_LINE} style={styles.title}>
          {item.projectName}
        </Text>
        <View style={styles.viewAddress}>
          {!isEmpty(item.projectAddress) && (
            <Text numberOfLines={ADDRESS_MAX_LINE} style={styles.address}>
              {item.projectAddress}
            </Text>
          )}
        </View>
        <RenderInfoProject
          overallDescription={item.overallDescription}
          totalArea={item.totalArea}
          startYear={item.startYear}
          commissionRates={item.commissionRates}
          minPrice={item.minPrice}
        />
      </View>
    </TouchableOpacity>
  );
};

SearchProjectItem.propTypes = {
  item: PropTypes.object.isRequired,
  style: ViewPropTypes.style,
};

SearchProjectItem.defaultProps = defaultProjectSearch;

export {SearchProjectItem};
