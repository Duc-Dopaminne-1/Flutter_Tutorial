import React from 'react';
import FastImage from 'react-native-fast-image';
import { AVATAR_PLACEHOLDER } from '@src/constants/icons';

declare type ResizeMode = 'contain' | 'cover' | 'stretch' | 'center';

interface Props {
  uri?: string;
  style?: object;
  resizeMode?: ResizeMode;
}

const CustomAvatar = (props: Props) => {
  const { uri, style, resizeMode } = props;

  return <FastImage style={style} resizeMode={resizeMode} source={uri ? { uri: uri } : AVATAR_PLACEHOLDER} />;
};

export { CustomAvatar };
