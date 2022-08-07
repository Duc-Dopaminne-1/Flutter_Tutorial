import React from 'react';
import {ImageBackground} from 'react-native';

import {IMAGES} from '../../assets/images';
import profileCommonStyle from './profileCommonStyle';

const ProfileHeader = () => {
  return (
    <ImageBackground style={profileCommonStyle.headerImage} source={IMAGES.HEADER_BG}>
      {/* <Text style={profileCommonStyle.titleLabel}>{title}</Text> */}
    </ImageBackground>
  );
};

export default ProfileHeader;
