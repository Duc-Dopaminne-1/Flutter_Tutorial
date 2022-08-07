import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {COLORS} from '../assets/theme/colors';
import {commonStyles} from '../assets/theme/styles';

const DropdownIcon = ({disabled, style, onPress = null}) => {
  return (
    <MaterialCommunityIcons
      // eslint-disable-next-line no-undefined
      pointerEvents={onPress === null ? 'none' : undefined}
      onPress={onPress}
      size={24}
      style={[commonStyles.dropdownIcon, style]}
      name="menu-down"
      color={disabled ? COLORS.TEXT_DARK_40 : COLORS.TEXT_DARK_10}
    />
  );
};

export default DropdownIcon;
