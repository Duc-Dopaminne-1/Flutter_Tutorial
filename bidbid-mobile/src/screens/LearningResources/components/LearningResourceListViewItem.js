import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {small} from '../../../assets/theme/metric';
import ImageProgress from '../../../components/ImageProgress';
import ScreenIds from '../../ScreenIds';
import {LearningResourceProps} from './LearningResourceKnowledgeItem';

const IMAGE_HEIGHT = 258;

function LearningResourceListViewItem(props: LearningResourceProps): React.ReactElement {
  const {
    item: {title, createdDatetime, previewImageUrl, preview = '', id},
    subTitle,
  } = props;
  const navigation = useNavigation();

  const renderDate = () => {
    return (
      <View style={styles.wrapDate}>
        <Text numberOfLines={2} style={styles.textTip}>
          {subTitle}
        </Text>
        <View style={styles.dot} />
        <Text numberOfLines={2} style={styles.textDate}>
          {createdDatetime}
        </Text>
      </View>
    );
  };

  const renderPreview = () => {
    if (preview) {
      return (
        <Text numberOfLines={2} style={styles.textPreview}>
          {preview}
        </Text>
      );
    }
  };

  const renderTitle = () => {
    return (
      <Text numberOfLines={2} style={styles.textTitle}>
        {title}
      </Text>
    );
  };

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
        {renderTitle()}
        {renderDate()}
        {renderPreview()}
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(LearningResourceListViewItem);

const styles = StyleSheet.create({
  containerImage: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  item: {
    width: '100%',
    marginBottom: SIZES.MARGIN_14,
  },
  imageStyle: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: small,
  },
  viewInfo: {
    flex: 1,
    padding: small,
  },
  textTitle: {
    color: COLORS.TEXT_DARK_10,
    ...FONTS.bold,
    ...FONTS.fontSize20,
    ...FONTS.nunitoRegular,
    fontWeight: '700',
  },
  textDate: {
    color: COLORS.TEXT_DARK_40,
    ...FONTS.nunitoRegular,
    ...FONTS.fontSize14,
    fontWeight: '400',
  },
  textTip: {
    color: COLORS.PRIMARY_A100,
    ...FONTS.nunitoRegular,
    ...FONTS.fontSize14,
    fontWeight: '400',
  },
  textPreview: {
    color: COLORS.TEXT_DARK_10,
    ...FONTS.nunitoRegular,
    ...FONTS.fontSize16,
    fontWeight: '400',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: SIZES.BORDER_RADIUS_100,
    backgroundColor: COLORS.TEXT_DARK_40,
    marginHorizontal: SIZES.MARGIN_6,
  },
  wrapDate: {
    paddingVertical: SIZES.PADDING_4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
