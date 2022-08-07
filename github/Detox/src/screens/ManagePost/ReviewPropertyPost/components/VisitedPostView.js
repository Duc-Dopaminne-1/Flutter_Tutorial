import React from 'react';

import {translate} from '../../../../assets/localize';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import Section from '../../../../components/Section';
import {Loading} from '../../../../components/SectionHorizontalList';
import {SkeletonPropertyHome} from '../../../../components/Skeleton';
import ListProperty from '../../../Home/PropertyHome/ListProperty';

export const VisitedPostView = ({
  posts,
  loading,
  onViewMore,
  isViewMoreVisible,
  actionInteractionVisitedItem,
}) => {
  return (
    <Section
      isViewMoreVisible={isViewMoreVisible}
      onViewMore={onViewMore}
      sectionName={translate('propertyPost.visitedProperty')}
      titleStyle={commonStyles.blackTextBold20}
      titleContainerStyle={[METRICS.resetMargin, METRICS.marginBottom, METRICS.horizontalPadding]}
      containerStyle={METRICS.resetMargin}>
      <Loading SkeletonComponent={<SkeletonPropertyHome />} loading={loading}>
        <ListProperty actions={actionInteractionVisitedItem} items={posts} />
      </Loading>
    </Section>
  );
};
