import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, View, ViewPropTypes} from 'react-native';

import {CONSTANTS, MAX_LENGTH} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {ICONS} from '../assets/icons';
import CustomIcon from '../assets/icons/CustomIcon';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {small, tiny} from '../assets/theme/metric';
import DebounceInput from './DebounceInput';

const containerPadding = Platform.OS === 'ios' ? 12 : tiny;
const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    paddingHorizontal: small,
    paddingVertical: containerPadding,
    borderRadius: 4,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    alignItems: 'center',
  },
  textSearch: {
    ...FONTS.regular,
    flex: 1,
    color: COLORS.BLACK_33,
    fontSize: 16,
    paddingLeft: 4,
  },
});

const SearchBoxComponent = ({
  style,
  value,
  onChangeKeyword,
  textSearchStyle,
  placeholder,
  delayTimeout,
  iconColor = COLORS.PRIMARY_A100,
}) => {
  return (
    <View style={[styles.viewContainer, style]}>
      <DebounceInput
        value={value}
        onChangeText={onChangeKeyword}
        style={[styles.textSearch, textSearchStyle]}
        maxLength={MAX_LENGTH.default}
        placeholder={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        delayTimeout={delayTimeout}
      />
      <CustomIcon name={ICONS.SEARCH} size={20} color={iconColor} />
    </View>
  );
};

SearchBoxComponent.propTypes = {
  style: ViewPropTypes.style,
  value: PropTypes.string,
  onChangeKeyword: PropTypes.func,
  textSearchStyle: Text.propTypes.style,
  placeholder: PropTypes.string,
  delayTimeout: PropTypes.number,
};

SearchBoxComponent.defaultProps = {
  value: '',
  onChangeKeyword: () => {},
  placeholder: '',
  delayTimeout: CONSTANTS.DEFAULT_KEYWORD_TIME_OUT,
};

export default SearchBoxComponent;
