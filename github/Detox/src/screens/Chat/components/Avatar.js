import React from 'react';

import {IMAGES} from '../../../assets/images';
import CustomAvatar from '../../../components/Avatar';

const AVATAR_SIZE = 48;

const Avatar = ({isGroup, url, size = AVATAR_SIZE}) => {
  return (
    <>
      {isGroup ? (
        <CustomAvatar size={size} defaultImage={IMAGES.IC_GROUP_AVATAR} />
      ) : (
        <CustomAvatar url={url} size={size} />
      )}
    </>
  );
};

export default Avatar;
