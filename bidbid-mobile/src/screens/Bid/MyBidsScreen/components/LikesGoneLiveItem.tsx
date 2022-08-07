import React, { ReactElement, useEffect } from 'react';
import { StyleSheet, ViewStyle, ImageStyle, Image } from 'react-native';
import { images } from '@/vars';
import ImageBlurLoading from 'react-native-image-blur-loading';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SocketManager } from '@/shared/socket/socket-manager';
import { Auction } from '@/models';

interface LikesGoneLiveItemProps {
  item: any;
  index: number;
  onPressed: (item, index) => void;
  containerStyle?: any;
}

export default function LikesGoneLiveItem(props: LikesGoneLiveItemProps): ReactElement {
  const { item, index, onPressed, containerStyle } = props;
  const { creator, id } = item;

  useEffect(() => {
    SocketManager.instanceBid.joinAuction(id, (_: Auction) => {});
  }, []);

  const renderAvatarImage = () => {
    if (creator?.avatar === null || creator?.avatar === undefined) {
      return <Image source={images.placeHolderFlatRight} style={[cell.thumbImage, containerStyle]} />;
    } else {
      return (
        <ImageBlurLoading
          withIndicator
          source={{ uri: creator?.avatar?.url }}
          style={[cell.thumbImage, containerStyle || {}]}
          thumbnailSource={images.placeHolderFlatRight}
        />
      );
    }
  };

  return (
    <TouchableOpacity style={[cell.container, containerStyle]} onPress={() => onPressed(item, index)}>
      {renderAvatarImage()}
    </TouchableOpacity>
  );
}

const cell = StyleSheet.create({
  container: {
    marginRight: 15,
    height: 120,
    width: 120,
    borderWidth: 0.1,
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  } as ViewStyle,

  thumbImage: {
    height: 120,
    width: 120,
    borderRadius: 12,
  } as ImageStyle,
});
