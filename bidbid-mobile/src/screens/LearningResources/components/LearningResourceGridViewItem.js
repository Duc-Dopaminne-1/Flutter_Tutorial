import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import ImageProgress from '../../../components/ImageProgress';
import ScreenIds from '../../ScreenIds';
import {LearningResourceProps} from './LearningResourceKnowledgeItem';

const IMAGE_HEIGHT = 157;
const IMAGE_WIDTH = METRICS.screenWidth / 2 - 25;

function LearningResourceGridViewItem(props: LearningResourceProps): React.ReactElement {
  const {
    item: {title, createdDatetime, previewImageUrl, id},
  } = props;
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(ScreenIds.LearningResourceDetailScreen, {articleId: id});
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <ImageProgress
        containerStyle={styles.containerImage}
        imageContainerStyle={styles.containerImage}
        imageStyle={styles.imageStyle}
        url={previewImageUrl}
      />
      <View style={styles.viewInfo}>
        <Text numberOfLines={2} style={styles.textTitle}>
          {title}
        </Text>
        <Text numberOfLines={2} style={styles.textDate}>
          {createdDatetime}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(LearningResourceGridViewItem);

const styles = StyleSheet.create({
  containerImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  item: {
    width: IMAGE_WIDTH,
    marginEnd: normal,
    borderRadius: small,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_BORDER,
    overflow: 'hidden',
    marginBottom: SIZES.MARGIN_16,
  },
  imageStyle: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderTopLeftRadius: small,
    borderTopRightRadius: small,
  },
  viewInfo: {
    flex: 1,
    padding: small,
  },
  textTitle: {
    color: COLORS.TEXT_DARK_10,
    ...FONTS.bold,
    ...FONTS.fontSize16,
    ...FONTS.nunitoRegular,
    fontWeight: '700',
  },
  textDate: {
    color: COLORS.TEXT_DARK_40,
    ...FONTS.nunitoRegular,
    ...FONTS.fontSize12,
  },
});
