import React, { FC, useCallback, useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import ImageZoomAndCrop, { ICropperParams } from 'react-native-image-zoom-and-crop';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import { colors, fonts, screenWidth } from '@/vars';
import CustomHeader from '@/components/CustomHeader';
import { useRoute } from '@react-navigation/core';
import { vs } from '@/vars/scaling';
import IconBack from '@/components/SVG/BackSvg';

const IMAGE_SIZE = screenWidth;
const OVERLAY_HEIGHT = (IMAGE_SIZE - vs(210)) / 2;

const CropProfilePicture: FC = () => {
  const route = useRoute();
  const { imageUri, callback } = route.params as any;
  const [cropperParams, setCropperParams] = useState<ICropperParams | null>(null);

  const handleSave = useCallback(() => {
    const cropSize = {
      width: IMAGE_SIZE * 2,
      height: (IMAGE_SIZE - OVERLAY_HEIGHT * 2) * 2,
    };
    const cropAreaSize = {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE - OVERLAY_HEIGHT * 2,
    };
    ImageZoomAndCrop.crop({
      ...cropperParams,
      imageUri: imageUri,
      cropSize,
      cropAreaSize,
    }).then(callback);
  }, [imageUri, cropperParams]);

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('moveAndScaleScreen.title')} />
      <View style={styles.imageContainer}>
        <ImageZoomAndCrop
          imageUri={imageUri}
          cropAreaWidth={IMAGE_SIZE}
          cropAreaHeight={IMAGE_SIZE}
          setCropperParams={setCropperParams}
          maxScale={3}
          areaOverlay={
            <>
              <View pointerEvents="none" style={[styles.overlayTop, { height: OVERLAY_HEIGHT }]} />
              <View pointerEvents="none" style={[styles.overlayBottom, { height: OVERLAY_HEIGHT }]} />
            </>
          }
          constraint={{
            offset: {
              x: 0,
              y: OVERLAY_HEIGHT,
            },
            size: {
              width: IMAGE_SIZE,
              height: IMAGE_SIZE - OVERLAY_HEIGHT * 2,
            },
          }}
        />
      </View>
      <View style={styles.bottomViewWrapper}>
        <Pressable style={styles.bottomView} onPress={handleSave}>
          <Text style={styles.submitText}>{language('save')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },

  imageContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },

  bottomViewWrapper: {
    paddingHorizontal: 15,
    paddingBottom: 40,
    paddingTop: 10,
    backgroundColor: colors.white,
  },

  bottomView: {
    height: 60,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.red_700,
  },

  submitText: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: fonts.size.s18,
    color: colors.white,
    fontFamily: fonts.family.PoppinsRegular,
  },

  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
    opacity: 0.7,
  },

  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
    opacity: 0.7,
  },
});

export default CropProfilePicture;
