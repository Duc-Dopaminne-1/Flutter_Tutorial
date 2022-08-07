import {useNavigation} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useGetProjectByIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {handleGetResponse} from '../../../api/utils';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';
import ImageProgress from '../../../components/ImageProgress';
import LinkTextButton from '../../../components/LinkTextButton';
import {getImageSize, IMAGE_RATIO, SCREEN_SIZE} from '../../../utils/ImageUtil';
import ScreenIds from '../../ScreenIds';

const IMAGE_SIZE = getImageSize(SCREEN_SIZE.WIDTH - 32, IMAGE_RATIO.R16x9);

const styles = StyleSheet.create({
  title: {
    ...FONTS.semiBold,
    paddingTop: 15,
    fontSize: 19,
  },
  name: {
    ...FONTS.semiBold,
    paddingTop: 15,
    fontSize: 19,
  },
  descriptionText: {
    ...FONTS.regular,
    fontSize: 13,
    paddingTop: 15,
    color: COLORS.PROJECT_DES,
  },
  linkTextButton: {
    paddingTop: 15,
  },
  picture: {
    ...METRICS.smallMarginTop,
    height: IMAGE_SIZE.HEIGHT,
    width: IMAGE_SIZE.WIDTH,
  },
});

const initialState = {picture: '', name: '', description: ''};
const ProjectInfo = ({projectId, freeTextProject, projectInfo}) => {
  const context = useContext(AppContext);
  const [state, setState] = useState(initialState);
  const navigation = useNavigation();

  const onPressViewDetail = () => {
    // Navigation to  project detail
    navigation.navigate(ScreenIds.ProjectDetail, {
      projectId: projectId ?? '',
    });
  };

  const [getProjectInfo, {data: projectResponse, loading, error}] = useGetProjectByIdLazyQuery({
    ...FETCH_POLICY.CACHE_AND_NETWORK,
  });
  useEffect(() => {
    const hasProjectInfo = projectInfo && !isEmpty(projectInfo);
    if (!hasProjectInfo && projectId) {
      getProjectInfo({variables: {projectId}});
    } else if (hasProjectInfo) {
      setState({
        ...state,
        name: projectInfo.projectName,
        description: projectInfo.projectDescription,
        picture: projectInfo.projectImage,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, projectInfo]);

  useEffect(() => {
    handleGetResponse(projectResponse?.foProjectById, false, error, context, response => {
      setState({
        ...state,
        name: response.projectName,
        description: response.projectDescription,
        picture: response.featurePhotos,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectResponse, loading, error]);
  if (!projectId || isEmpty(projectId)) {
    return freeTextProject ? (
      <>
        <Text style={styles.title}>{translate(STRINGS.PROJECT_DETAIL)}</Text>
        <Text style={styles.name}>{freeTextProject}</Text>
      </>
    ) : null;
  }
  return (
    <View>
      <Text style={styles.title}>{translate(STRINGS.PROJECT_DETAIL)}</Text>
      {!!state.picture && (
        <ImageProgress
          containerStyle={styles.picture}
          imageContainerStyle={styles.picture}
          url={state.picture}
        />
      )}
      {!!state.name && <Text style={styles.name}>{state.name}</Text>}
      {!!state.description && <Text style={styles.descriptionText}>{state.description}</Text>}
      {!!projectId && (
        <LinkTextButton
          style={styles.linkTextButton}
          onPress={onPressViewDetail}
          title={translate(STRINGS.VIEW_DETAIL)}
        />
      )}
    </View>
  );
};

export default ProjectInfo;
