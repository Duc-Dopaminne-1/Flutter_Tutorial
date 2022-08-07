import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {FONT_SEMI_BOLD} from '../../../../assets/fonts';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {normal, small} from '../../../../assets/theme/metric';
import Avatar from '../../../../components/Avatar';
import RatingComponent from '../../../../components/Rating/RatingComponent';
import MeasureUtils from '../../../../utils/MeasureUtils';

const AVATAR_SIZE = 70;
const IMAGE_RATING = 16;

const PADDING_CELL = small;

const SELECTED_ICON_SIZE = 30;

const HEIGHT_RANK_BADGE = 25;

const PADDING_LEFT_CONTAINER = normal;
const PADDING_RIGHT_CONTAINER = small;

const MARGIN_LEFT_NAME = normal;

const MARGIN_RIGHT_SELECTED = normal;

const NAME_WIDTH =
  Dimensions.get('window').width -
  normal * 2 -
  PADDING_LEFT_CONTAINER -
  AVATAR_SIZE -
  MARGIN_LEFT_NAME -
  SELECTED_ICON_SIZE -
  MARGIN_RIGHT_SELECTED -
  PADDING_RIGHT_CONTAINER;

export const getFullSizeSellAgentItem = async item => {
  const fullName = item.fullName;
  const nameSize = await MeasureUtils.measureTextSize({
    text: fullName,
    fontSize: 16,
    fontFamily: FONT_SEMI_BOLD,
    width: NAME_WIDTH,
    lineInfoForLine: 1,
  });
  const avaSize = AVATAR_SIZE;
  const columnNameRankSize = nameSize.height + IMAGE_RATING + HEIGHT_RANK_BADGE + small * 2;
  const result = Math.max(avaSize, columnNameRankSize) + PADDING_CELL * 2;
  return result;
};

const TopenerItem = ({item, onPress, isSelected, disabled = false, customComponent}) => {
  const selectedItemBackgroundColor = isSelected ? {backgroundColor: COLORS.PRIMARY_A20} : {};
  return (
    <TouchableOpacity
      style={[styles.viewContainer, selectedItemBackgroundColor]}
      onPress={() => onPress(item)}
      disabled={disabled}>
      {customComponent}
      <View style={styles.viewAvatarAndName}>
        <Avatar size={AVATAR_SIZE} url={item.profilePhoto ?? item.avatar ?? ''} />
        <View style={styles.columnNameRank}>
          <Text style={styles.nameStyle} numberOfLines={1}>
            {item.name ?? item.fullName ?? ''}
          </Text>
          <View style={HELPERS.row}>
            <Image style={styles.iconTopener} source={IMAGES.LOGO_CIRCLE} />
            <Text style={{...FONTS.regular}}>{translate(STRINGS.TOPENER)}</Text>
          </View>
          <RatingComponent
            rateNumber={item.rating ?? item.agentRating ?? 0}
            backgroundColor={COLORS.NEUTRAL_WHITE}
            imageSize={IMAGE_RATING}
          />
        </View>
      </View>
      <Icon
        style={styles.selectedIcon}
        size={24}
        color={isSelected ? COLORS.PRIMARY_A100 : COLORS.GREY_E4}
        name={isSelected ? 'check-box' : 'check-box-outline-blank'}
      />
    </TouchableOpacity>
  );
};

TopenerItem.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};

TopenerItem.defaultProps = {
  onPress: () => {},
};

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    paddingVertical: PADDING_CELL,
    paddingLeft: PADDING_LEFT_CONTAINER,
    paddingRight: PADDING_RIGHT_CONTAINER,
    borderTopWidth: 1,
    borderColor: COLORS.GREY_F0,
  },
  columnNameRank: {
    marginLeft: MARGIN_LEFT_NAME,
    marginRight: SELECTED_ICON_SIZE + MARGIN_RIGHT_SELECTED,
    flexShrink: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameStyle: {
    fontSize: 16,
    ...FONTS.semiBold,
    color: COLORS.TEXT_DARK_10,
  },
  selectedIcon: {
    position: 'absolute',
    alignSelf: 'center',
    right: MARGIN_RIGHT_SELECTED,
  },
  viewAvatarAndName: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    flexShrink: 1,
    marginVertical: 5,
  },
  iconTopener: {width: 20, height: 20, marginRight: small},
});

export default TopenerItem;
