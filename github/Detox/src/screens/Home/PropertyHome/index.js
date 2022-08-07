import React from 'react';

import {translate} from '../../../assets/localize';
import {METRICS} from '../../../assets/theme/metric';
import Section from '../../../components/Section';
import {Loading} from '../../../components/SectionHorizontalList';
import {SkeletonPropertyHome} from '../../../components/Skeleton';
import styles from '../styles';
import ListProperty from './ListProperty';

const PropertyHome = ({items, navigation, onPressViewMore, loading, actions}) => {
  return (
    <Section
      isViewMoreVisible
      onViewMore={onPressViewMore}
      sectionName={translate('home.property')}
      titleStyle={[styles.sectionText]}
      containerStyle={METRICS.resetMargin}>
      <Loading SkeletonComponent={<SkeletonPropertyHome />} loading={loading}>
        <ListProperty items={items} actions={actions} navigation={navigation} />
      </Loading>
    </Section>
  );
};

export default PropertyHome;
