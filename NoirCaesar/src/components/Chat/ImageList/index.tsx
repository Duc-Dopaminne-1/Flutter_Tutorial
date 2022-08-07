import React, { useEffect, useMemo } from 'react';
import { FlatList, Image, View } from 'react-native';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { WIDTH_RATIO, WIDTH } from '@src/constants/vars';
import { useDispatch, useSelector } from 'react-redux';
import { saveImageSize } from '@src/modules/chat/message/actions';
import { IPhotoSize } from '@src/modules/chat/message';
import { RootState } from '@src/types/types';
import ChatImageItem from './ChatImageItem';

interface Props {
  channelId?: string;
  messageId: string;
  images?: string[];
  onPressImage?: (index: number) => any;
}

const ImageList = (props: Props) => {
  const { channelId, messageId, images = [], onPressImage } = props;
  const dispatch = useDispatch();
  const imageSize = useSelector<RootState, IPhotoSize>(state => {
    if (channelId && state.chatMessage[channelId] && state.chatMessage[channelId].photoSizeList[messageId]) {
      return state.chatMessage[channelId].photoSizeList[messageId];
    } else {
      return {
        width: ((WIDTH - 30) / 2) * WIDTH_RATIO,
        height: ((WIDTH - 30) / 2) * WIDTH_RATIO
      };
    }
  });

  useEffect(() => {
    if (!channelId) return;
    Image.getSize(
      images[0],
      (width, height) => {
        dispatch(saveImageSize({
          channelId: channelId,
          messageId: messageId,
          width: width,
          height: height
        }))
      },
      error => {
        console.log(`Couldn't get the image size: ${error.message}`);
      },
    );
  }, []);

  const getData = () => {
    return images.length > 3 ? images.slice(0, 4) : images.slice(0, 2);
  };

  const handleItemPress = (index: number) => {
    onPressImage && onPressImage(index)
  }

  const renderImage = ({ item, index }: { item: string; index: number }) => {
    const otherImageNumber = images.length - getData().length;
    const renderOtherText = index === getData().length - 1 && otherImageNumber > 0;
    return (
      <ChatImageItem
        item={item}
        renderOtherText={renderOtherText}
        otherImageNumber={otherImageNumber}
        onItemPress={handleItemPress.bind(undefined, index)}
      />
    );
  };

  const renderSingleImage = useMemo(() => {
    return <Image style={styles.singleImage} source={{ uri: images[0] }} />;
  }, [images[0]]);

  const renderSingleImageView = useMemo(() => {
    return (
      <CustomTouchable style={{ width: imageSize.width, height: imageSize.height }} onPress={() => onPressImage && onPressImage(0)}>
        {renderSingleImage}
      </CustomTouchable>
    );
  }, [imageSize]);

  const keyExtractor = (item: string, index: number) => {
    return `${item}-${index}`;
  };

  const renderFlatlist = () => {
    const numberOfColumns = images.length > 1 ? 2 : 1;
    return (
      <FlatList
        style={styles.flatList}
        data={getData()}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        renderItem={renderImage}
        numColumns={numberOfColumns}
      />
    );
  };

  return <View style={styles.container}>{images.length === 1 ? renderSingleImageView : renderFlatlist()}</View>;
};

export default ImageList;
