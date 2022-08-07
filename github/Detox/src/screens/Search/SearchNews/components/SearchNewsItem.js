import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {small, tiny} from '../../../../assets/theme/metric';
import ImageProgress from '../../../../components/ImageProgress';
import {getHeightImageDimension, IMAGE_RATIO} from '../../../../utils/ImageUtil';
import {dateToString} from '../../../../utils/TimerCommon';

const imageItemHeight = getHeightImageDimension(2, IMAGE_RATIO.R2x4);

const SearchNewsItem = ({
  item,
  onPressItem = () => {},
  containerStyle = {},
  isBorderLine = true,
}) => {
  if (!item) return null;
  return (
    <TouchableOpacity onPress={() => onPressItem(item)} style={[styles.container, containerStyle]}>
      <ImageProgress
        containerStyle={styles.imageContainer}
        imageContainerStyle={styles.imageContainer}
        imageStyle={styles.image}
        url={item?.previewImageUrl}
      />
      <View style={[styles.viewInfo, isBorderLine ? styles.borderLine : {}]}>
        <Text style={styles.textTitle}>{item?.title ?? ''}</Text>
        <View style={styles.subTitleContainer}>
          <Text style={styles.textCategory}>{item?.articleType ?? ''}</Text>
          <Text style={styles.textTime}> • {dateToString(item?.createdDatetime)}</Text>
        </View>
        <Text style={styles.textPreview} numberOfLines={3}>
          {item?.preview}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  textTitle: {fontSize: 18, color: COLORS.TEXT_DARK_10, marginTop: small, ...FONTS.bold},
  textPreview: {
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
    marginVertical: small,
    ...FONTS.regular,
  },
  imageContainer: {
    height: imageItemHeight.height,
    width: '100%',
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  image: {height: imageItemHeight.height, width: '100%', borderRadius: SIZES.BORDER_RADIUS_8},
  viewInfo: {
    paddingBottom: 10,
  },
  borderLine: {
    borderBottomWidth: 1,
    borderColor: COLORS.NEUTRAL_DIVIDER,
  },
  subTitleContainer: {flexDirection: 'row', marginTop: tiny},
  textCategory: {color: COLORS.PRIMARY_A100, fontSize: 12},
  textTime: {color: COLORS.TEXT_DARK_40, fontSize: 12},
});

export default SearchNewsItem;
