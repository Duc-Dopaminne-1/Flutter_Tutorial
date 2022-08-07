import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import ImageProgress from '../../../../components/ImageProgress';
import {IMAGE_RATIO} from '../../../../utils/ImageUtil';
import {dateToString} from '../../../../utils/TimerCommon';
import {LearningResource} from '../../utils/LearningResourcesUtils';

type ArticleMostViewedItemProps = {
  onPress: () => void,
  item: LearningResource,
};

const ArticleMostViewedItem = ({onPress = () => {}, item = {}}: ArticleMostViewedItemProps) => {
  if (!item) return <></>;

  const {title, previewImageUrl, createdDatetime} = item;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageProgress
        url={previewImageUrl}
        imageStyle={styles.thumbnail}
        containerStyle={styles.thumbnail}
        imageContainerStyle={styles.thumbnail}
      />
      <View style={styles.leftContent}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.date}>{dateToString(createdDatetime)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const IMAGE_WIDTH_PERCENT = 0.25;
const ITEM_WIDTH = SIZES.SCREEN_WIDTH - SIZES.PADDING_16 * 2;

const styles = StyleSheet.create({
  container: {
    ...HELPERS.row,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: SIZES.BORDER_RADIUS_8,
    marginBottom: SIZES.MARGIN_16,
  },
  thumbnail: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRadius: SIZES.BORDER_RADIUS_8,
    width: ITEM_WIDTH * IMAGE_WIDTH_PERCENT,
    height: (ITEM_WIDTH * IMAGE_WIDTH_PERCENT) / IMAGE_RATIO.R4x3,
  },
  title: {
    fontSize: SIZES.FONT_16,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  date: {
    fontSize: SIZES.FONT_14,
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
    marginTop: SIZES.MARGIN_4,
  },
  leftContent: {
    flex: 1,
    paddingLeft: SIZES.PADDING_16,
    paddingVertical: SIZES.PADDING_8,
    paddingRight: SIZES.PADDING_8,
  },
});

export default ArticleMostViewedItem;
