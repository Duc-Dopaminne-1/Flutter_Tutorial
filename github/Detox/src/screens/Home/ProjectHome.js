import {useAnalytics} from '@segment/analytics-react-native';
import React from 'react';
import {FlatList} from 'react-native';

import {translate} from '../../assets/localize';
import {METRICS} from '../../assets/theme/metric';
import ProjectItem from '../../components/ProjectItem';
import Section from '../../components/Section';
import {Loading} from '../../components/SectionHorizontalList';
import {SkeletonProjectHome} from '../../components/Skeleton';
import {projectPaddingStyle} from '../../utils/RenderUtil';
import ScreenIds from '../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../WithSegment';
import styles from './styles';

const ProjectHome = ({items, navigation, loading, onPressViewMore, actions}) => {
  const {track} = useAnalytics();

  const openProjectDetail = projectInfo => {
    track(TrackingActions.productClicked, {
      category: Category.project,
      click_location: ClickLocation.home,
      investor: projectInfo?.investorOwnerName,
      project: {
        name: projectInfo?.projectName,
        address: projectInfo?.address,
        image_url: projectInfo?.bannerImage,
        start_year: projectInfo?.startYear,
        price: projectInfo?.minPrice,
      },
    });

    navigation.navigate(ScreenIds.ProjectDetail, {projectId: projectInfo?.projectId});
  };

  return (
    <Section
      onViewMore={onPressViewMore}
      isViewMoreVisible
      sectionName={translate('home.hotProjects')}
      titleStyle={[styles.sectionText]}
      containerStyle={METRICS.marginTop}>
      <Loading SkeletonComponent={<SkeletonProjectHome />} loading={loading}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          horizontal
          data={items}
          renderItem={({item, index}) => (
            <ProjectItem
              style={projectPaddingStyle(index)}
              projectInfo={item}
              onPress={openProjectDetail}
              actions={actions}
            />
          )}
        />
      </Loading>
    </Section>
  );
};

export default ProjectHome;
