import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {Text, View} from 'react-native';

import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {METRICS} from '../../assets/theme/metric';
import ImageProgress from '../../components/ImageProgress';
import NewTabBar from '../../components/NewTabBar';
import VideoWebView from '../../components/VideoWebView';
import styles from './styles';

const routes = [
  {key: STRINGS.VIEW_3D, title: translate(STRINGS.VIEW_3D)},
  {key: STRINGS.STREET_VIEW, title: translate(STRINGS.STREET_VIEW)},
  {key: STRINGS.VIDEO, title: translate(STRINGS.VIDEO)},
];

const EmptyTab = () => {
  return (
    <View style={styles.emptyTab}>
      <Text style={styles.emptyTabText}>{translate(STRINGS.DO_NOT_HAVE_DATA)}</Text>
    </View>
  );
};

const ProjectInfoTab = ({view3d, streetView, video}) => {
  const renderScene = ({route}) => {
    switch (route.key) {
      case STRINGS.VIDEO:
        return isEmpty(video) ? (
          <EmptyTab />
        ) : (
          <VideoWebView style={styles.sceneContainer} url={video} />
        );
      case STRINGS.VIEW_3D:
        return isEmpty(view3d) ? (
          <EmptyTab />
        ) : (
          <ImageProgress
            url={view3d}
            containerStyle={styles.sceneContainer}
            imageContainerStyle={styles.sceneContainer}
          />
        );
      case STRINGS.STREET_VIEW:
        return isEmpty(streetView) ? (
          <EmptyTab />
        ) : (
          <ImageProgress
            url={streetView}
            containerStyle={styles.sceneContainer}
            imageContainerStyle={styles.sceneContainer}
          />
        );
      default:
        return <EmptyTab />;
    }
  };
  return (
    <View style={styles.projectInfoTabStyle}>
      <NewTabBar
        routes={routes}
        renderScene={renderScene}
        sceneContainerStyle={METRICS.marginTop}
      />
    </View>
  );
};

export default ProjectInfoTab;
