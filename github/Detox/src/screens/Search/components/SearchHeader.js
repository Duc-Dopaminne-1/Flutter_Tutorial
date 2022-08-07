import PropTypes from 'prop-types';
import React from 'react';
import {Image, Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {CONSTANTS, MAX_LENGTH} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import DebounceInput from '../../../components/DebounceInput';
import {useHardwareBackPress} from '../../../hooks/useHardwareBackPress';
import {testProps} from '../../../utils/testProps';
import {ids} from '../../ids';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.row,
    ...HELPERS.center,
    paddingVertical: SIZES.PADDING_12,
  },
  backButtonContainer: {zIndex: 999},
  leftContainer: {
    alignItems: 'center',
    marginLeft: small,
    width: '10%',
  },
  rightContainer: {
    ...HELPERS.row,
    ...HELPERS.center,
    flex: 1,
    marginRight: normal,
    zIndex: 999,
    borderRadius: 5,
  },
  searchContainer: {
    ...HELPERS.center,
    ...HELPERS.row,
    ...METRICS.horizontalPadding,
    paddingRight: 0,
    flex: 1,
    height: 40,
    borderRadius: 5,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  searchIcon: {},
  textSearch: {
    ...FONTS.regular,
    ...HELPERS.fill,
    color: COLORS.BLACK_33,
    fontSize: SIZES.FONT_16,
    marginLeft: small,
  },
  icon: {
    width: 48,
    height: 48,
  },
  searchMapIcon: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 16,
  },
  iconSearch: {
    width: 20,
    height: 20,
  },
});

const SearchHeader = ({
  onBackPress,
  onFilterPress,
  onClearPress,
  isSearchMap,
  onMapPress,
  value,
  onChangeKeyword,
  autoFocus = false,
  isClearText = false,
  showRightIcon = true,
  iconSize = 24,
  style,
  customTextStyle,
  delayTimeout,
  renderLeft = true,
  customStyle,
  placeholder = translate(STRINGS.SEARCH_PROPERTY_PLACEHOLDER),
  container = {},
  maxLength,
  onFocusSearchBox,
  showHeaderShadow = false,
}) => {
  useHardwareBackPress(renderLeft && onBackPress);
  const onPressRightButton = () => {
    Keyboard.dismiss();
    isClearText ? onClearPress() : onFilterPress();
  };
  return (
    <View style={style}>
      <View style={[styles.container, container]}>
        {renderLeft && (
          <View style={styles.leftContainer}>
            <TouchableOpacity
              {...testProps(ids.common.backButton)}
              style={styles.backButtonContainer}
              onPress={onBackPress}
              hitSlop={CONSTANTS.HIT_SLOP_NO_RIGHT}>
              <View style={isSearchMap ? {} : styles.searchMapIcon}>
                <Image source={IMAGES.ARROW_LEFT_LINEAR} />
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.rightContainer}>
          <View style={[styles.searchContainer, customStyle]}>
            <View style={styles.searchIcon}>
              <Image source={IMAGES.IC_SEARCH} style={styles.iconSearch} resizeMode="contain" />
            </View>
            <DebounceInput
              value={value}
              onChangeText={onChangeKeyword}
              autoFocus={autoFocus}
              delayTimeout={delayTimeout}
              returnKeyType={'search'}
              style={[styles.textSearch, customTextStyle]}
              maxLength={maxLength ? maxLength : MAX_LENGTH.default}
              placeholder={placeholder}
              autoCorrect={false}
              autoCapitalize="none"
              onFocus={onFocusSearchBox}
            />
            {showRightIcon && (
              <CustomButton
                onPress={onPressRightButton}
                style={styles.icon}
                iconName={isClearText ? IMAGES.IC_DISMISS : IMAGES.IC_FILTER}
                iconColor={COLORS.BLUE_56}
                iconSize={iconSize}
              />
            )}
            {onMapPress && (
              <CustomButton
                style={styles.icon}
                onPress={onMapPress}
                iconName={isSearchMap ? IMAGES.IC_MAP : IMAGES.IC_LIST}
                iconColor={COLORS.BLUE_56}
                iconSize={24}
              />
            )}
          </View>
        </View>
      </View>
      {!!showHeaderShadow && (
        <View style={HELPERS.zIndexView}>
          <View style={styles.shadowContainer}>
            <LinearGradient
              colors={[COLORS.BLACK_OPACITY_01, COLORS.TRANSPARENT_OPACITY]}
              style={[commonStyles.separatorRow12, {backgroundColor: COLORS.TRANSPARENT}]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

SearchHeader.propTypes = {
  onBackPress: PropTypes.func,
  onFilterPress: PropTypes.func,
  onChangeKeyword: PropTypes.func,
  maxLength: PropTypes.number,
};

SearchHeader.defaultProps = {
  isSearchMap: true,
  onBackPress: () => {},
  onFilterPress: () => {},
  onChangeKeyword: () => {},
};

export default SearchHeader;
