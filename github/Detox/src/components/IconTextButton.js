/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, ViewPropTypes} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomIcon from '../assets/icons/CustomIcon';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {small, tiny} from '../assets/theme/metric';

const styles = StyleSheet.create({
  icon: {
    paddingVertical: small,
  },
  description: {
    color: COLORS.PRIMARY_A100,
    ...FONTS.bold,
    paddingLeft: 8,
    alignSelf: 'center',
    marginBottom: tiny,
  },
});

const IconTextButton = ({
  styleText,
  iconSize,
  color,
  imageName,
  title,
  onPress,
  style,
  isCustomIcon,
  image,
  disabled = false,
  isIconLeft = true,
  iconStyle,
  isMaterialIcon,
}) => {
  return (
    <TouchableOpacity style={[HELPERS.rowStartCenter, style]} onPress={onPress} disabled={disabled}>
      {isIconLeft || <Text style={[styles.description, styleText]}>{title}</Text>}
      {isCustomIcon ? (
        <CustomIcon
          style={[styles.icon, iconStyle]}
          name={imageName}
          size={iconSize}
          color={color}
        />
      ) : image ? (
        <Image style={[styles.icon, iconStyle]} source={image} resizeMode="contain" />
      ) : isMaterialIcon ? (
        <MaterialIcon
          style={[styles.icon, iconStyle]}
          name={imageName}
          size={iconSize}
          color={color}
        />
      ) : (
        <Icon style={[styles.icon, iconStyle]} name={imageName} size={iconSize} color={color} />
      )}
      {isIconLeft && <Text style={[styles.description, styleText]}>{title}</Text>}
    </TouchableOpacity>
  );
};

IconTextButton.propTypes = {
  styleImage: ViewPropTypes.style,
  iconSize: PropTypes.number,
  onPress: PropTypes.func,
  imageName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
};

IconTextButton.defaultProps = {
  styleImage: {},
  iconSize: 24,
  onPress: () => {},
  imageName: '',
  title: '',
  color: COLORS.PRIMARY_A100,
  isCustomIcon: false,
};

export default IconTextButton;
