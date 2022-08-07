import React, { useState } from "react";
import { ImageSourcePropType, View, ActivityIndicator, Platform } from "react-native";
import { styles } from "./styles";
import IMAGE_DEFAULT from '@res/icons/ForLeaseForSale/image-default.jpg';
import FastImage, { ResizeMode } from "react-native-fast-image";

export interface Props {
  avatar?: string;
  size?: number;
  width?: number;
  height?: number;
  resizeMode?: ResizeMode;
  borderColor?: string;
  imageDefault?: ImageSourcePropType;
  styleContainer?: object;
  styleImage?: object;
}
const RectangleAvatar = (props: Props) => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const { styleContainer, width = 52, height = 52, avatar = '',
    resizeMode = undefined, borderColor = 'gray',
    imageDefault = IMAGE_DEFAULT, styleImage } = props;
  const getUriImage = () => {
    if (Platform.OS === 'ios') {
      return avatar && typeof avatar === 'string' ? avatar : null
    } else {
      if (avatar && typeof avatar === 'string') {
        if (avatar.includes("http") || avatar.includes("file://")) {
          return avatar;
        }
      }
      return '';
    }
  }
  const normalisedAvatar = getUriImage();

  return (
    <View style={[styles.thumbnail, { borderColor: borderColor, height: 'auto', width: 'auto' }, styleContainer]}>
      {isError && <FastImage source={imageDefault} style={[{
        width: width,
        height: height,
      }, styles.placeholderThumb]} />}
      <FastImage
        style={[{
          position: isError ? 'absolute' : undefined,
          height: height,
          width: width,
        }, styles.placeholderThumb, styleImage]}
        source={{ uri: normalisedAvatar ?? '' }}
        resizeMode={resizeMode}
        onLoadStart={() => {
          setIsLoading(true)
        }}
        onError={() => {
          setIsError(true)
        }}
        onLoadEnd={() => {
          setIsLoading(false)
        }}
      />
      {isLoading && <View style={[{
        width: width,
        height: height
      }, styles.spinnerContainer]}><ActivityIndicator size='small' color='white' /></View>}
    </View>
  );
}

export default React.memo(RectangleAvatar);
