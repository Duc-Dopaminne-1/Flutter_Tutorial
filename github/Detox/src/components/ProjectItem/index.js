import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {ITEM_TYPE, ONE_LINE_TEXT, UPDATE_ITEM_STRATEGY} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {FONT_REGULAR, FONT_SEMI_BOLD} from '../../assets/fonts';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal, small} from '../../assets/theme/metric';
import {extractAddressData} from '../../utils/DataProcessUtil';
import {getFullSizeImageDimension} from '../../utils/ImageUtil';
import MeasureUtils from '../../utils/MeasureUtils';
import Avatar from '../Avatar';
import BannerImageProject from '../BannerImageProject';
import FollowButton from '../Button/FollowButton';
import {defaultProject, ProjectProps} from './types';

const fullSize = getFullSizeImageDimension();
const tipRateWidth = Math.ceil((fullSize.width * 20) / 100);
const imageWidth = fullSize.width;
const imageHeight = fullSize.height;
const margin = normal * 3;
const addressWidth = imageWidth - tipRateWidth - small;

const FONT_SIZE_ADDRESS = 13;
const FONT_SIZE_TITLE = 15;
const ICON_MEMBER_SIZE = 32;
const styles = StyleSheet.create({
  containerSmall: {
    flexWrap: 'wrap',
    width: 276,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  viewInvestor: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
  },
  avatarViewer: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    marginLeft: 5,
    borderRadius: 26,
  },
  textOwnerName: {
    fontSize: 14,
    ...FONTS.regular,
    color: COLORS.PRIMARY_A100,
    marginLeft: small,
    flexShrink: 1,
    flex: 1,
  },
});

export const ItemHeight = async property => {
  const titleSize = await MeasureUtils.measureTextSize({
    text: ONE_LINE_TEXT,
    fontSize: FONT_SIZE_TITLE,
    fontFamily: FONT_SEMI_BOLD,
    width: imageWidth,
    lineInfoForLine: 1,
  });

  const addressSize = await MeasureUtils.measureTextSize({
    fontSize: FONT_SIZE_ADDRESS,
    fontFamily: FONT_REGULAR,
    text: extractAddressData(property.propertyAddress, true),
    width: addressWidth,
    lineInfoForLine: 2,
  });

  return imageHeight + margin + titleSize.height + addressSize.height + 24;
};

export const ProjectItemHeight = () => 262;

export const InvestorOwnerView = ({
  logo,
  logoStyle,
  customStyle,
  name,
  isFollowed,
  projectId,
  actions,
}) => {
  return (
    <View style={[styles.viewInvestor, customStyle]}>
      <Avatar
        containerStyle={[styles.avatarViewer, logoStyle]}
        resizeMode={'contain'}
        url={logo}
        size={ICON_MEMBER_SIZE}
      />
      <Text numberOfLines={2} style={styles.textOwnerName}>
        {name}
      </Text>
      {isFollowed && (
        <FollowButton
          isHomePage={true}
          followStrategy={UPDATE_ITEM_STRATEGY.NORMAL}
          isFollowed={isFollowed}
          projectId={projectId}
          actions={actions}
        />
      )}
    </View>
  );
};

const ProjectItem = (props: ProjectProps) => {
  const {
    projectInfo,
    style,
    onPress,
    actions,
    isTesting = false,
    isShowFollower = false,
    isShowFollowButton = true,
    unfollowStrategy = UPDATE_ITEM_STRATEGY.NORMAL,
    followStrategy = UPDATE_ITEM_STRATEGY.NORMAL,
    projectPostId,
    itemType = ITEM_TYPE.small,
  } = props;
  const statusPosition = {top: itemType === ITEM_TYPE.small ? 140 : 190};
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.containerSmall, style]}
      onPress={() => onPress(projectInfo)}>
      <BannerImageProject
        unfollowStrategy={unfollowStrategy}
        followStrategy={followStrategy}
        actions={actions}
        isTesting={isTesting}
        projectInfo={projectInfo}
        isShowFollowButton={isShowFollowButton}
        project={projectPostId}
        itemType={itemType}
        statusPosition={statusPosition}
        statusTextStyle={projectInfo?.statusTextStyle}
        projectId={projectInfo?.projectId}
        url={projectInfo.bannerImage}
        isFollowCountVisible={isShowFollower}
        status={projectInfo.projectStatusName}
        statusStyle={projectInfo.backgroundStatus}
        isShowStatus={projectInfo.isShowStatus}
        isFollowed={projectInfo.isFollowed}
      />
    </TouchableOpacity>
  );
};

ProjectItem.propTypes = {
  projectInfo: PropTypes.object.isRequired,
};

ProjectItem.defaultProps = defaultProject;

export default React.memo(ProjectItem, (props, nextProps) => {
  if (props?.projectInfo?.isFollowed !== nextProps?.projectInfo?.isFollowed) {
    return false;
  }
  return true;
});
