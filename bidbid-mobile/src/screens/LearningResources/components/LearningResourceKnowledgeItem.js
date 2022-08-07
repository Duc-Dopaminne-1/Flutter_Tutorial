import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';
import ScreenIds from '../../ScreenIds';

export interface LearningResourceItem {
  id: string;
  slug: string;
  title: string;
  preview: string;
  articleType: string;
  createdDatetime: string;
  previewImageUrl: string;
}

export interface LearningResourceProps {
  item: LearningResourceItem;
  subTitle?: string;
}

export const LEARNING_RESOURCE_IMAGE_COMMON_WIDTH = METRICS.screenWidth - 32;
export const LEARNING_RESOURCE_IMAGE_COMMON_HEIGHT = 260;

function LearningResourceKnowledgeItem(props: LearningResourceProps): React.ReactElement {
  const {title, createdDatetime, previewImageUrl, id} = props.item;
  const {navigate} = useNavigation();

  const onPress = () => {
    navigate(ScreenIds.LearningResourceDetailScreen, {articleId: id});
  };

  return (
    <Pressable onPress={onPress}>
      <FastImage source={{uri: previewImageUrl}} resizeMode={'stretch'} style={styles.image}>
        <Text numberOfLines={2} style={styles.textDate}>
          {createdDatetime}
        </Text>
        <Text numberOfLines={4} style={styles.textTitle}>
          {title}
        </Text>
      </FastImage>
    </Pressable>
  );
}

export default React.memo(LearningResourceKnowledgeItem);

const styles = StyleSheet.create({
  image: {
    height: LEARNING_RESOURCE_IMAGE_COMMON_HEIGHT,
    width: LEARNING_RESOURCE_IMAGE_COMMON_WIDTH,
    borderRadius: SIZES.BORDER_RADIUS_22,
    marginRight: SIZES.MARGIN_32,
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.PADDING_8,
    paddingVertical: SIZES.PADDING_8,
  },
  textDate: {
    color: COLORS.NEUTRAL_WHITE,
    ...FONTS.fontSize14,
    ...FONTS.nunitoRegular,
    fontWeight: '400',
  },
  textTitle: {
    color: COLORS.NEUTRAL_WHITE,
    ...FONTS.fontSize20,
    ...FONTS.nunitoRegular,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});
