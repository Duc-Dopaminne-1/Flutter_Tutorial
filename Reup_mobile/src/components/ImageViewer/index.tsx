import React, { useState } from 'react';
import { ViewStyle, TextStyle, ImageStyle, View, Modal } from 'react-native';
// import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import { WIDTH } from '@src/constants/vars';
import { CustomText } from '../CustomText';
import { CustomHeader } from '../CustomHeader';
import { BACK } from '@src/constants/icons';
import styles from './styles';

export interface Style {
  textTitle: TextStyle;
  activityIndicatorWrapper: ViewStyle;
  image: ImageStyle;
  buttonClose: ViewStyle;
  containerButton: ViewStyle;
  textButton: TextStyle;
}

export interface Props {
  loading: boolean;
  onBackdropPress: () => void;
  images: any;
  index: number;
}

const ImageViewerCustom = (props: Props) => {
  const { loading = false, onBackdropPress, images } = props;

  const renderHeader = () => <CustomHeader styleHeader={styles.header} leftImage={BACK} leftAction={onBackdropPress} />;

  return (
    <Modal visible={loading}>
      <ImageViewer
        index={props.index}
        renderHeader={renderHeader}
        style={styles.imageViewer}
        imageUrls={images} />
    </Modal>
  );
};
export { ImageViewerCustom };
