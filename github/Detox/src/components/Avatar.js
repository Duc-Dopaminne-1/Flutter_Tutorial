import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';

import {CONSTANTS, GENDER_TYPE} from '../assets/constants';
import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {ids} from '../screens/ids';
import {testProps} from '../utils/testProps';
import ImageProgress from './ImageProgress';

const styles = StyleSheet.create({
  defaultNameStyle: {
    fontSize: 16,
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_10,
  },
  rightBottomIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: -2,
  },
  rightBottomIcon: size => ({
    width: size / 3,
    height: size / 3,
    borderRadius: 16,
  }),
});

const checkRenderAvatar = (avatar, gender, defaultImage) => {
  if (!isEmpty(avatar)) {
    return avatar;
  } else {
    switch (gender) {
      case GENDER_TYPE.MALE:
        return IMAGES.IC_MALE;
      case GENDER_TYPE.FEMALE:
        return IMAGES.IC_FEMALE;
      case GENDER_TYPE.NA:
        return IMAGES.IC_GENDER_OTHER;
      default:
        return defaultImage;
    }
  }
};

const RightBottomIcon = ({size, onPress}) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={onPress}
    hitSlop={CONSTANTS.HIT_SLOP_SMALL}
    style={styles.rightBottomIconContainer}>
    <Image
      source={IMAGES.IC_ADD_CIRCLE}
      style={styles.rightBottomIcon(size)}
      resizeMode="contain"
    />
  </TouchableOpacity>
);

const Avatar = ({
  url,
  size = 80,
  name,
  containerStyle,
  nameStyle,
  isLoading = false,
  resizeMode,
  defaultImage = IMAGES.IC_DEFAULT_AVATAR,
  onPress = null,
  isShowBtnAdd = false,
  gender,
  onPressIsVerifyProfilePhoto,
  isVerifyProfilePhoto,
  disableOnPress,
}) => {
  const imageStyle = imageSize => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      height: imageSize,
      backgroundColor: COLORS.TRANSPARENT,
      width: imageSize,
      borderRadius: imageSize / 2,
    };
  };

  const AvatarView = (
    <>
      <View style={{width: size, height: size}}>
        <ImageProgress
          url={url}
          resizeMode={resizeMode}
          defaultImage={checkRenderAvatar(url, gender, defaultImage)}
          containerStyle={imageStyle(size)}
          imageContainerStyle={imageStyle(size)}
          imageStyle={imageStyle(size)}>
          <ActivityIndicator animating={isLoading} color={COLORS.PRIMARY_A100} />
        </ImageProgress>
        {isVerifyProfilePhoto && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={onPressIsVerifyProfilePhoto}
            style={[
              imageStyle(size),
              {
                backgroundColor: COLORS.SUBSCRIPTION_CARD_SHADOW_COLOR,
              },
            ]}
          />
        )}
        {isShowBtnAdd && <RightBottomIcon onPress={onPress} size={size} />}
      </View>
      {!isEmpty(name) && (
        <Text
          {...testProps(ids.profile.fullNameLabel)}
          style={[styles.defaultNameStyle, nameStyle]}>
          {name}
        </Text>
      )}
    </>
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={containerStyle}
      onPress={onPress}
      disabled={disableOnPress}>
      {AvatarView}
    </TouchableOpacity>
  );
};

Avatar.propTypes = {
  url: PropTypes.string,
  size: PropTypes.number,
  name: PropTypes.string,
  containerStyle: ViewPropTypes.style,
};

Avatar.defaultProps = {
  name: '',
  size: 115,
  containerStyle: {},
  nameStyle: {},
};

export default Avatar;
