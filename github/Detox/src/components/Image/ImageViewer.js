import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import ImageView from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {downloadImage} from '../../utils/fileHandler';
import {SCREEN_SIZE, STATUSBAR_HEIGHT} from '../../utils/ImageUtil';
import CustomButton from '../Button/CustomButton';

type Image = {
  url: String,
};

type ImageSource = {
  source: Image,
};
const SWIPE_DOWN_THRESHOLD = 200;

const ImageViewer = ({
  visible,
  images,
  initialIndex,
  onDismiss,
  hideShareButton = false,
  onChangeIndex,
}: {
  visible: Boolean,
  images: Array<ImageSource>,
  initialIndex: Number,
  onDissmiss: Function,
  hideShareButton: Boolean,
  onChangeIndex: Function,
}) => {
  const indexImage = useRef(initialIndex);
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    indexImage.current = initialIndex;
  }, [initialIndex]);

  const onChange = index => {
    indexImage.current = index;
    onChangeIndex && onChangeIndex(index);
  };

  const saveImage = async () => {
    if (images.length) {
      const URL_IMAGE = images[indexImage.current].url;
      downloadImage({urlImage: URL_IMAGE});
    }
  };

  const containerAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(animatedValue.value, [0, SWIPE_DOWN_THRESHOLD], [1, 0], Extrapolate.CLAMP),
  }));

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      useNativeDriver={true}
      statusBarTranslucent={true}
      deviceHeight={SCREEN_SIZE.HEIGHT}
      deviceWidth={SCREEN_SIZE.WIDTH}
      style={[styles.modal]}>
      <Animated.View style={[styles.container, containerAnimation]}>
        <ImageView
          imageUrls={images}
          index={initialIndex}
          saveToLocalByLongPress={false}
          useNativeDriver={true}
          onChange={onChange}
          enableSwipeDown={true}
          swipeDownThreshold={SWIPE_DOWN_THRESHOLD}
          onSwipeDown={onDismiss}
          onMove={position => {
            animatedValue.value = position.positionY;
          }}
          loadingRender={() => <ActivityIndicator />}
        />
        <CustomButton
          mode="icon"
          icon={<MaterialCommunityIcons size={30} name="close" color={COLORS.NEUTRAL_WHITE} />}
          style={[styles.iconButton, {left: SIZES.SEPARATOR_16}]}
          onPress={onDismiss}
        />
        {!hideShareButton && (
          <CustomButton
            mode="icon"
            icon={<MaterialIcons size={30} name="save-alt" color={COLORS.NEUTRAL_WHITE} />}
            style={[styles.iconButton, {right: SIZES.SEPARATOR_16}]}
            onPress={saveImage}
          />
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {margin: 0},
  container: {
    flex: 1,
    backgroundColor: COLORS.NEUTRAL_BLACK,
  },
  iconButton: {position: 'absolute', top: STATUSBAR_HEIGHT, zIndex: 99},
});

export default ImageViewer;
