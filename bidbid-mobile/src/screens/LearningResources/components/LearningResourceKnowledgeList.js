import React, {memo, useState} from 'react';
import {StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import {SIZES} from '../../../assets/constants/sizes';
import {METRICS} from '../../../assets/theme/metric';
import {Pagination} from '../../../components/Pagination';
import {Loading} from '../../../components/SectionHorizontalList';
import {SkeletonLearningResources} from '../../../components/Skeleton';
import LearningResourceKnowledgeItem, {
  LEARNING_RESOURCE_IMAGE_COMMON_HEIGHT,
  LearningResourceProps,
} from './LearningResourceKnowledgeItem';

interface LearningResourceKnowledgeListProps {
  shouldShowLoading: boolean;
  listResource: LearningResourceProps[];
}

function LearningResourceKnowledgeList(
  props: LearningResourceKnowledgeListProps,
): React.ReactElement {
  const {shouldShowLoading = false, listResource = []} = props;
  const [indexPage, setIndexPage] = useState(0);

  const renderItem = ({item}) => {
    return <LearningResourceKnowledgeItem item={item} />;
  };

  const onSnapToItem = (index: number) => {
    setIndexPage(index);
  };

  return (
    <>
      <Loading SkeletonComponent={<SkeletonLearningResources />} loading={shouldShowLoading}>
        <Carousel
          data={listResource}
          renderItem={renderItem}
          width={METRICS.screenWidth}
          loop={true}
          height={LEARNING_RESOURCE_IMAGE_COMMON_HEIGHT + 10}
          autoPlay
          onSnapToItem={onSnapToItem}
        />
      </Loading>
      <Pagination
        dotsLength={listResource.length}
        activeDotIndex={indexPage}
        style={styles.paginationContainer}
        dotStyle={styles.dotStyle}
      />
    </>
  );
}

export default memo(LearningResourceKnowledgeList);

const styles = StyleSheet.create({
  paginationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotStyle: {
    width: 10,
    height: 10,
    marginHorizontal: SIZES.MARGIN_4,
  },
});
