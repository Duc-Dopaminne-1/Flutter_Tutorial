import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import {ImageStyleProp, ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal, small, smallNormal, tiny} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import {usePhotoViewer} from '../../hooks/usePhotoViewer';
import ImageViewer from '../Image/ImageViewer';
import ImageHorizontalList from '../List/ImageHorizontalList';

type StatusTagProps = {
  isVisible: Boolean,
  containerStyle: ViewStyleProp,
  iconLeft: ImageSourcePropType,
  statusText: String,
  statusTextStyle: TextStyle,
  iconLeftStyle: ViewStyleProp,
};

type ImageSliderProps = {
  onPressPhotoLibrary: (index: Number) => {},
  images: Array<String>,
  onPress3D: Function,
  onPressStreetView: Function,
  onPressVideo: Function,
  statuses: Array<StatusTagProps>,
  showStreetView: Boolean,
  show3D: Boolean,
  showVideo: Boolean,
  hideShareButton: Boolean,
  hideStatusBar: Boolean,
  showArrow: Boolean,
  containerStyle: ViewStyleProp,
  imageContainerStyle: ViewStyleProp,
  listContainerStyle: ViewStyleProp,
  imageStyle: ImageStyleProp,
};

const aspectRatio = 16 / 9;
const IMAGES_WIDTH = Dimensions.get('window').width;
const IMAGES_HEIGHT = IMAGES_WIDTH / aspectRatio;

const StatusTag = ({
  isVisible = false,
  containerStyle,
  iconLeft = '',
  statusText = '',
  statusTextStyle,
  iconLeftStyle = {},
}: StatusTagProps) => {
  if (isVisible) {
    return (
      <View style={[styles.statusView, containerStyle]}>
        <View style={[HELPERS.rowCenter, METRICS.microPaddingBottom]}>
          {!!iconLeft && (
            <>
              <Image
                source={iconLeft}
                style={{...styles.iconStatus, ...iconLeftStyle}}
                resizeMode="contain"
              />
              <View style={commonStyles.separatorColumn4} />
            </>
          )}
          <Text style={[styles.statusText, statusTextStyle]}>{statusText}</Text>
        </View>
      </View>
    );
  }
  return null;
};

const GetStatusTags = statusProps => {
  if (!statusProps) {
    return null;
  }

  return (
    <>
      {statusProps?.map((e, index) => (
        <StatusTag
          key={`${e?.statusText}_${index}`}
          isVisible={e?.isVisible}
          containerStyle={e?.containerStyle}
          statusText={e?.statusText}
          statusTextStyle={e?.statusTextStyle}
          iconLeft={e?.iconLeft}
          iconLeftStyle={e?.iconLeftStyle}
        />
      ))}
    </>
  );
};

const ImageSlider = ({
  images,
  onPressPhotoLibrary,
  showArrow,
  onPressStreetView,
  onPress3D,
  onPressVideo,
  statuses,
  showStreetView,
  show3D,
  showVideo,
  hideShareButton = false,
  hideStatusBar = false,
  containerStyle,
  imageContainerStyle,
  listContainerStyle,
  imageStyle,
  isTesting = false,
}: ImageSliderProps) => {
  const [isViewingIndex, setIsViewingIndex] = useState(0);

  const {
    state: statePhotoViewer,
    setState: setStatePhotoViewer,
    onDismissImageViewer,
    onPressImage,
  } = usePhotoViewer();

  const updateImageState = () => {
    if (images && images?.length > 0) {
      setStatePhotoViewer({
        ...statePhotoViewer,
        images: images.map(e => ({url: e?.url || e?.uri}))?.filter(e => e.url),
      });
    }
  };
  useEffect(updateImageState, [images]);

  const updateViewingIndex = index => {
    setIsViewingIndex(index);
  };

  const onPressPhoto = index => {
    onPressImage(index);
    onPressPhotoLibrary && onPressPhotoLibrary(index);
  };

  const showUtilities = showStreetView || show3D || showVideo;

  const onPressArrowRight = () => {
    setIsViewingIndex(isViewingIndex + 1);
  };

  const onPressArrowleft = () => {
    setIsViewingIndex(isViewingIndex - 1);
  };

  return (
    <>
      <View style={[styles.propertyImage, containerStyle]}>
        <ImageHorizontalList
          onPress={onPressPhoto}
          images={images}
          viewableImageIndex={updateViewingIndex}
          viewingImageIndex={isViewingIndex}
          imageContainerStyle={imageContainerStyle}
          imageStyle={imageStyle}
          style={listContainerStyle}
        />
        <View style={styles.statusContainer}>{statuses && GetStatusTags(statuses)}</View>
        {showArrow && (
          <View style={styles.arrowContainer}>
            {isViewingIndex > 0 && (
              <TouchableOpacity style={styles.iconArrowLeftContainer} onPress={onPressArrowleft}>
                <Image
                  source={IMAGES.ARROW_LEFT_LINEAR}
                  style={styles.iconArrowLeft}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            {isViewingIndex < images?.length - 1 && (
              <TouchableOpacity style={styles.iconArrowRightContainer} onPress={onPressArrowRight}>
                <Image
                  source={IMAGES.ARROW_RIGHT_LINEAR}
                  style={styles.iconArrowRight}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={styles.imageBottomInfoContainer}>
          <View style={styles.imageCountContainer}>
            <Image source={IMAGES.IC_IMAGE} style={styles.imageIcons} resizeMode="contain" />
            <View style={commonStyles.separatorColumn4} />
            <Text style={styles.textCommission}>
              {isViewingIndex + 1 + '/' + (images?.length || 1)}
            </Text>
          </View>
          {showUtilities && (
            <View style={styles.imageCountContainer}>
              {showStreetView && (
                <TouchableOpacity onPress={onPressStreetView}>
                  <Image
                    source={IMAGES.STREETVIEW_FILL}
                    style={styles.utilitiesIcons}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              {show3D && (
                <>
                  <View style={commonStyles.separatorColumn8} />
                  <TouchableOpacity onPress={onPress3D}>
                    <Image
                      source={IMAGES.BAD_FILL}
                      style={styles.utilitiesIcons}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </>
              )}
              {showVideo && (
                <>
                  <View style={commonStyles.separatorColumn8} />
                  <TouchableOpacity onPress={onPressVideo}>
                    <Image
                      source={IMAGES.IC_VIDEO}
                      style={styles.videoIcons}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </View>
      {isTesting || (
        <ImageViewer
          visible={statePhotoViewer.visible}
          images={statePhotoViewer.images}
          hideStatusBar={hideStatusBar}
          initialIndex={statePhotoViewer.index}
          onDismiss={onDismissImageViewer}
          hideShareButton={hideShareButton}
          onChangeIndex={index => {
            updateViewingIndex(index);
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  statusView: {
    backgroundColor: COLORS.BOOKING_COMPLETED,
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
    borderRadius: SIZES.BORDER_RADIUS_20,
    alignSelf: 'flex-start',
  },
  textCommission: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.NEUTRAL_WHITE,
  },
  imageCountContainer: {
    flexDirection: 'row',
    ...HELPERS.center,
    backgroundColor: COLORS.BLACK_33_OPACITY,
    borderRadius: 5,
    paddingHorizontal: small,
    paddingVertical: tiny,
  },
  propertyImage: {
    height: IMAGES_HEIGHT,
    width: IMAGES_WIDTH,
    position: 'relative',
  },
  imageBottomInfoContainer: {
    position: 'absolute',
    bottom: smallNormal,
    left: normal,
    right: normal,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageIcons: {
    width: 16,
    height: 16,
    tintColor: COLORS.NEUTRAL_WHITE,
  },
  utilitiesIcons: {
    width: 24,
    height: 24,
    tintColor: COLORS.NEUTRAL_WHITE,
  },
  iconStatus: {
    width: 16,
    height: 16,
  },
  // StatusTag styles
  statusText: {
    fontSize: 12,
    ...FONTS.regular,
  },
  statusContainer: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    zIndex: 1,
  },
  videoIcons: {
    width: 24,
    height: 24,
  },
  arrowContainer: {
    position: 'absolute',
    top: '44%',
    left: 16,
    right: 16,
    flexDirection: 'row',
    zIndex: 1,
    justifyContent: 'space-between',
  },
  iconArrowRight: {
    width: 16,
    height: 16,
    tintColor: COLORS.NEUTRAL_WHITE,
  },
  iconArrowLeft: {
    width: 16,
    height: 16,
    tintColor: COLORS.NEUTRAL_WHITE,
  },
  iconArrowLeftContainer: {
    position: 'absolute',
    left: 0,
    padding: 8,
    borderRadius: SIZES.BORDER_RADIUS_50,
    backgroundColor: COLORS.BLACK_31_OPACITY_07,
  },
  iconArrowRightContainer: {
    position: 'absolute',
    right: 0,
    padding: 8,
    borderRadius: SIZES.BORDER_RADIUS_50,
    backgroundColor: COLORS.BLACK_31_OPACITY_07,
  },
});

export default ImageSlider;
