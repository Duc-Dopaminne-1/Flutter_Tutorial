import {useAnalytics} from '@segment/analytics-react-native';
import React from 'react';

import {
  useGetProjectSuggestionLazyQuery,
  useGetPropertyPostSuggestionLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {DEFAULT_PAGE_SIZE, UPDATE_ITEM_STRATEGY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';
import PropertyWithProjectList from '../PropertyWithProjectList';

const SuggestionPostScreen = () => {
  const {track} = useAnalytics();
  const projectsProps = {
    queryParam: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
    useQuery: useGetProjectSuggestionLazyQuery,
    responseDataKey: 'curProjectSuggestions',
  };

  const propertyProps = {
    queryParam: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
    responseDataKey: 'curPropertyPostSuggestions',
    useQuery: useGetPropertyPostSuggestionLazyQuery,
  };

  const onPressProperty = item => {
    track(TrackingActions.productClicked, {
      category: Category.profile,
      click_location: ClickLocation.suggestedPost,
      name: item?.title ?? '',
    });
  };

  const onPressProject = item => {
    track(TrackingActions.productClicked, {
      category: Category.profile,
      click_location: ClickLocation.suggestedPost,
      name: item?.projectName ?? '',
      investor: item?.investorOwnerName ?? '',
    });
  };

  return (
    <PropertyWithProjectList
      followStrategy={UPDATE_ITEM_STRATEGY.REMOVE_FROM_LIST}
      screenTitle={translate(STRINGS.PROPERTY_POST_SUGGESTION)}
      projectsProps={projectsProps}
      propertyProps={propertyProps}
      onPressPropertyPost={onPressProperty}
      onPressProject={onPressProject}
    />
  );
};

export default SuggestionPostScreen;
