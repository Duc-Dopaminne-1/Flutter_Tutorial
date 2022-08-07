import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, ViewStyle} from 'react-native';

import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';

const DocumentItem = ({
  name,
  onPress,
  linkStyle,
  containerStyle,
  iconStyle,
  disabled = false,
  icon = IMAGES.FILE_FILL,
  hideRightIcon = false,
}: {
  containerStyle: ViewStyle,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, containerStyle]}
      onPress={onPress}>
      <Image source={icon} style={styles.fileIcon} resizeMode="contain" />
      <Text style={[styles.fileName, linkStyle]} numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>
      {disabled || hideRightIcon || (
        <Image
          style={[styles.downloadIcon, iconStyle]}
          source={IMAGES.DOWNLOAD_FILL}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...HELPERS.rowCenter,
    paddingVertical: 16,
  },
  downloadIcon: {},
  fileIcon: {
    width: 24,
    height: 24,
  },
  fileName: {
    flex: 1,
    marginLeft: 8,
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
  },
});

export default DocumentItem;
