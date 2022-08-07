import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import CustomIcon from '../assets/icons/CustomIcon';
import {COLORS} from '../assets/theme/colors';

const styles = StyleSheet.create({
  buttonBack: {
    width: 20,
  },
});

const CustomIconButton = ({
  style,
  onPress,
  image,
  hitSlop,
  customImageName,
  customImageSize,
  imageStyle,
  iconColor = COLORS.PRIMARY_A100,
  iconName,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.buttonBack, style]}
      onPress={onPress}
      hitSlop={hitSlop}>
      {customImageName && (
        <CustomIcon
          onPress={onPress}
          name={customImageName}
          size={customImageSize}
          color={iconColor}
        />
      )}
      {image && <Image source={image} style={imageStyle} />}
      {iconName && (
        <Icon style={imageStyle} name={iconName} size={customImageSize} color={iconColor} />
      )}
    </TouchableOpacity>
  );
};

CustomIconButton.propTypes = {
  onPress: PropTypes.func,
  customImageSize: PropTypes.number,
};

CustomIconButton.defaultProps = {
  onPress: () => {},
  hitSlop: {},
  customImageSize: 20,
  imageStyle: {},
};

export default CustomIconButton;
