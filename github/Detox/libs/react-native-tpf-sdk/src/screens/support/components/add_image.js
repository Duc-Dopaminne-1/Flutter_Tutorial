import React, { useCallback, useMemo, useContext } from 'react';
import { ICClose02, ICImagePicker } from '../../../assets/icons';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BORDER_RADIUS } from '../../../constants/size';
import { scale } from '../../../utils/responsive';
import AppText from '../../../components/app_text';
import __ from 'lodash';
import themeContext from '../../../constants/theme/themeContext';
const AddImage = ({ icCloseStyle, style, images, imageStyle, onRemoveImage, addImage }) => {
  const theme = useContext(themeContext);
  const _removeImage = useCallback(
    item => {
      typeof onRemoveImage === 'function' && onRemoveImage(item);
    },
    [onRemoveImage]
  );
  const _imageStyle = useMemo(() => {
    return [styles.image, imageStyle];
  }, [imageStyle]);
  const _icCloseStyle = useMemo(() => {
    return [styles.close, icCloseStyle];
  }, [icCloseStyle]);

  const removeImage = item => {
    const index = __.findIndex(images, o => o.filename === item?.filename);
    if (index > -1) {
      images.splice(index, 1);
      _removeImage(images);
    }
  };
  const _style = useMemo(() => {
    return [styles.container, style];
  }, [style]);
  return (
    <View style={_style}>
      <AppText bold translate style={[styles.imgTitle, { color: theme.text.primary }]}>
        {'common.image'}
      </AppText>
      <View style={styles.imgSection}>
        {images.map((item, index) => (
          <View key={(item?.id || index).toString()}>
            <View style={[imageStyle, styles.background]} />
            <TouchableOpacity
              onPress={() => {
                removeImage(item);
              }}
              style={_icCloseStyle}>
              <ICClose02 />
            </TouchableOpacity>
            <FastImage source={{ uri: item?.sourceURL || item?.path }} style={[_imageStyle]} />
          </View>
        ))}
        <TouchableOpacity onPress={addImage} style={styles.addImage}>
          <ICImagePicker
            color1={theme?.app?.primaryColor1}
            height={imageStyle?.height || scale(104, false)}
            width={imageStyle?.width || scale(104)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(AddImage);

const styles = StyleSheet.create({
  image: {
    height: scale(104, false),
    width: scale(104),
    borderRadius: BORDER_RADIUS,
    marginRight: scale(12),
    marginTop: scale(12)
  },
  noMarginImage: {
    marginRight: 0
  },
  imgSection: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  addImage: {
    marginTop: scale(12)
  },
  imgTitle: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  container: {
    flex: 1
  },
  close: {
    zIndex: 5,
    top: scale(18),
    right: scale(20),
    width: scale(16.25),
    height: scale(16.25),
    position: 'absolute'
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    left: 0,
    borderRadius: BORDER_RADIUS
  }
});
