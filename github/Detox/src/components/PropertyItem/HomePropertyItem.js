import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ViewPropTypes} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, small} from '../../assets/theme/metric';
import {defaultProperty, PropertyItemType} from '../../screens/Home/TopenerOfMonth/types';
import {getImageSize, IMAGE_RATIO} from '../../utils/ImageUtil';
import BannerImageProject from '../BannerImageProject';

export const CARD_WIDTH = 276;
const imageSize = getImageSize(CARD_WIDTH, IMAGE_RATIO.R2x1);
const fontSizeTitle = 16;
const fontSizeText = 14;
const lintHeightTitle = 26;
const minHeightTite = 60;

export const ItemHeight = async ({isShowBroker = true}) => {
  return isShowBroker ? 450 : 380;
};

const HomePropertyItem = (props: PropertyItemType) => {
  const {style, onPress, actions, isShowFollowButton = true, isTesting = false} = props;
  const itemStyle = [
    styles.containerSmall,
    {borderWidth: SIZES.BORDER_WIDTH_1, borderColor: COLORS.SEPARATOR_LINE},
  ];
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[itemStyle, {width: imageSize.WIDTH}, style]}
      disabled={onPress ? false : true}
      onPress={() => onPress(props)}>
      <View style={styles.contentStyle}>
        <Text numberOfLines={2} style={styles.title}>
          {props.title}
        </Text>
        <View style={HELPERS.row}>
          <BannerImageProject
            actions={actions}
            isShowStatus={false}
            resizeMode={'cover'}
            width={115}
            isTesting={isTesting}
            height={88}
            customStyle={styles.image}
            isProperty={true}
            isFollowed={props.isFollowed}
            propertyPostId={props.propertyPostId}
            isShowFollowButton={isShowFollowButton}
            followButtonStyle={styles.iconFollow}
            isBanner
            url={props.images}
          />

          <View style={styles.infoView}>
            <Text numberOfLines={2} style={{...FONTS.regular, fontSize: fontSizeText}}>
              {props?.address}
            </Text>
            <Text style={styles.textPrice}>
              {props.price}
              <Text style={styles.textArea}>{` - ${props.buildingArea} m²`}</Text>
            </Text>
            <Text style={styles.textDirection}>{props?.direction ?? '--'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

HomePropertyItem.propTypes = {
  style: ViewPropTypes.style,
  isSmallStyle: PropTypes.bool,
};

HomePropertyItem.defaultProps = defaultProperty;

const styles = StyleSheet.create({
  containerSmall: {
    flexWrap: 'wrap',
    width: imageSize.width,
    borderRadius: SIZES.BORDER_RADIUS_8,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    margin: 2,
  },
  contentStyle: {
    paddingBottom: 12,
    ...METRICS.smallHorizontalPadding,
  },
  title: {
    ...FONTS.bold,
    fontSize: fontSizeTitle,
    lineHeight: lintHeightTitle,
    marginTop: 8,
    height: minHeightTite,
    color: COLORS.TEXT_DARK_10,
  },
  image: {
    borderRadius: SIZES.BORDER_RADIUS_8,
    width: 115,
    height: 88,
    flex: null,
    overflow: 'hidden',
  },
  infoView: {flex: 1.2, marginLeft: small, justifyContent: 'space-between'},
  iconFollow: {top: 60, left: 5},
  textPrice: {fontSize: fontSizeText, color: COLORS.PRIMARY_B100, ...FONTS.bold},
  textDirection: {fontSize: fontSizeText, ...FONTS.regular},
  textArea: {
    color: COLORS.TEXT_DARK_10,
    ...FONTS.regular,
    fontSize: fontSizeText,
  },
});

export default HomePropertyItem;
