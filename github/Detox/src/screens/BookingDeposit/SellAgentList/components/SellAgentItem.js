import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {SIZES} from '../../../../assets/constants/sizes';
import {FONT_SEMI_BOLD} from '../../../../assets/fonts';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {normal, small} from '../../../../assets/theme/metric';
import Avatar from '../../../../components/Avatar';
import MeasureUtils from '../../../../utils/MeasureUtils';

const AVATAR_SIZE = 70;
const IMAGE_RATING = 16;

const PADDING_CELL = 11;

const SELECTED_ICON_SIZE = 30;

const HEIGHT_RANK_BADGE = 25;

const PADDING_LEFT_CONTAINER = normal;
const PADDING_RIGHT_CONTAINER = small;

const MARGIN_LEFT_NAME = 12;

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

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    paddingVertical: PADDING_CELL,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderTopWidth: 1,
    borderColor: COLORS.GREY_F0,
    paddingHorizontal: normal,
    margin: 0,
  },
  columnNameRank: {
    marginLeft: MARGIN_LEFT_NAME,
    paddingVertical: 12,
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: SELECTED_ICON_SIZE + MARGIN_RIGHT_SELECTED,
  },
  nameStyle: {
    fontSize: SIZES.FONT_16,
    ...FONTS.semiBold,
    color: COLORS.TEXT_DARK_10,
    maxWidth: 200,
  },
  selectedIcon: {
    position: 'absolute',
    alignSelf: 'center',
    right: MARGIN_RIGHT_SELECTED,
  },
  viewAvatarAndName: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  title: {fontSize: SIZES.FONT_14, color: COLORS.PRIMARY_A100, ...FONTS.regular},
});

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

export const ItemAgentHeight = () => {
  return 122;
};

const SellAgentItem = ({
  item,
  onPress,
  isSelected,
  disabled = false,
  customComponent,
  containerStyle,
}) => {
  const selectedItemBackgroundColor = isSelected ? {backgroundColor: COLORS.PRIMARY_A10} : {};
  return (
    <TouchableOpacity
      style={[styles.viewContainer, selectedItemBackgroundColor, containerStyle]}
      onPress={() => onPress(item)}
      disabled={disabled}>
      {customComponent}
      <View style={styles.viewAvatarAndName}>
        <Avatar size={AVATAR_SIZE} url={item.profilePhoto ?? item.avatar ?? ''} />
        <View style={styles.columnNameRank}>
          <Text style={styles.nameStyle} numberOfLines={1}>
            {item.name ?? item.fullName ?? ''}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {translate('common.consultant')}
          </Text>
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

SellAgentItem.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};

SellAgentItem.defaultProps = {
  onPress: () => {},
};

export default SellAgentItem;
