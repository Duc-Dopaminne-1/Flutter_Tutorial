import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import ImageProgress from '../../../components/ImageProgress';
import ImageSlider from '../../../components/Slider/ImageSlider';
import {getImageSize, IMAGE_RATIO, SCREEN_SIZE} from '../../../utils/ImageUtil';
import PropertyType from '../../ManagePost/PropertyType';
import {ListInfoContent, SecondInfoMainRow} from './ConfirmPropertyComponents';

const MARGIN_HORIZONTAL = normal;
const IMAGE_SIZE = getImageSize(SCREEN_SIZE.WIDTH - MARGIN_HORIZONTAL * 2, IMAGE_RATIO.R16x9);

const styles = StyleSheet.create({
  viewContainer: {
    marginHorizontal: MARGIN_HORIZONTAL,
    marginBottom: normal,
  },
  imageItem: {
    height: IMAGE_SIZE.HEIGHT,
    width: IMAGE_SIZE.WIDTH,
    borderRadius: small,
    backgroundColor: COLORS.TEXT_DARK_40,
  },
  imageList: {
    marginVertical: small,
    borderRadius: SIZES.BORDER_RADIUS_8,
    overflow: 'hidden',
  },
  normalTitleText: {
    ...FONTS.bold,
    fontSize: 16,
  },
  separator: {
    width: '90%',
    marginHorizontal: '5%',
    height: 1,
    backgroundColor: COLORS.SEPARATOR_LINE,
  },
});

const postDescriptionStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: 10,
  },
  valueText: {
    marginTop: normal,
    ...FONTS.regular,
  },
});

export const getPropertyPostTitle = data => {
  if (!(data && data.propertyType)) {
    return '';
  }
  const {projectName, floorOrSubAreaCode} = data;
  const floorOrSubAreaText =
    data.propertyType === PropertyType.apartment
      ? translate(STRINGS.TOWER)
      : translate(STRINGS.SUB_AREA);
  return `${projectName} - ${floorOrSubAreaText} ${floorOrSubAreaCode}`;
};

const useConfirmPropertyMainInfo = ({data, onPressToProjectDetail}) => {
  const PostDescriptionContent = ({postDescription}) => {
    return (
      <View style={postDescriptionStyle.container}>
        <Text style={styles.normalTitleText}>{translate('common.description')}</Text>
        <Text style={postDescriptionStyle.valueText}>{postDescription}</Text>
      </View>
    );
  };
  const props: ConfirmPropertyType = {
    data,
    onPressToProjectDetail,
    PostDescriptionContent,
  };
  return props;
};

type ConfirmPropertyType = {
  data: any,
  onPressToProjectDetail: () => {},
  PostDescriptionContent: String,
};

const ConfirmPropertyMainInfo = ({data, onPressToProjectDetail}) => {
  const props = useConfirmPropertyMainInfo({data, onPressToProjectDetail});
  return <ConfirmProperty {...props} />;
};

export default ConfirmPropertyMainInfo;

export const ConfirmProperty = ({
  data,
  onPressToProjectDetail,
  PostDescriptionContent,
}): ConfirmPropertyType => {
  return (
    <View style={styles.viewContainer}>
      {data?.images?.length > 0 ? (
        <ImageSlider
          listContainerStyle={styles.imageList}
          imageStyle={{width: IMAGE_SIZE.WIDTH}}
          imageContainerStyle={{width: IMAGE_SIZE.WIDTH}}
          containerStyle={{width: IMAGE_SIZE.WIDTH}}
          images={data?.images}
          showArrow
        />
      ) : (
        <ImageProgress
          containerStyle={[METRICS.smallVerticalMargin, styles.imageItem]}
          imageContainerStyle={[METRICS.smallVerticalMargin, styles.imageItem]}
        />
      )}
      <SecondInfoMainRow data={data} />
      <ListInfoContent onPressToProjectDetail={onPressToProjectDetail} data={data} />
      <View style={styles.separator} />
      <PostDescriptionContent
        postDescription={data.postDescription}
        propertyType={data.propertyType}
      />
    </View>
  );
};
