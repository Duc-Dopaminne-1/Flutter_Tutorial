import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { CustomHeader } from '../CustomHeader';
import { CLOSE } from '@src/constants/icons';
import styles from './styles';
import NavigationActionsService from '@src/navigation/navigation';
import Container from '../Container';

export interface Props {
  images: any;
  index: number;
}

const ImageViewerCustom = (props: Props) => {
  const { images, index } = props;

  const closeViewer = () => {
    NavigationActionsService.dismissModal();
  };

  const renderHeader = () => <CustomHeader containerStyle={styles.header} leftImage={CLOSE} leftAction={closeViewer} />;

  const renderImageViewer = () => (
    <ImageViewer
      style={styles.imageViewer}
      imageUrls={images}
      index={index}
      enablePreload
      enableSwipeDown
      saveToLocalByLongPress={false}
      onSwipeDown={closeViewer}
    />
  );

  return (
    <Container>
      {renderImageViewer()}
      {renderHeader()}
    </Container>
  );
};
export { ImageViewerCustom };
