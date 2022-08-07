import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext} from 'react';
import {useSelector} from 'react-redux';

import {
  useGetFollowedProjectByFollowerIdLazyQuery,
  useGetPropertyPostsByFollowerIdLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {getUserId} from '../../../appData/user/selectors';
import {APPROVAL_STATUS, DEFAULT_PAGE_SIZE, UPDATE_ITEM_STRATEGY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {getPropertyPostApprovalStatusByKeyArr} from '../../../utils/GetMasterData';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';
import PropertyWithProjectList from '../PropertyWithProjectList';

const getPropertyParams = ({masterData, userId}) => {
  const approvalStatus = getPropertyPostApprovalStatusByKeyArr(masterData, [
    APPROVAL_STATUS.APPROVAL,
    APPROVAL_STATUS.SOLD,
  ]);
  const statusIds = approvalStatus.map(status => status.propertyPostApprovalStatusId);
  const params = {
    followerId: userId,
    cursor: '',
    pageSize: DEFAULT_PAGE_SIZE,
    filter: {
      propertyPostApprovalStatusId_in: statusIds,
    },
  };
  return params;
};

const getProjectParam = ({userId}) => {
  return {
    followerId: userId,
    cursor: '',
    pageSize: DEFAULT_PAGE_SIZE,
  };
};

const PropertyPostTrackingScreen = ({route}) => {
  const {track} = useAnalytics();
  const userId = useSelector(getUserId);
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const initialCounts = {
    postFollowB2CCount: route.params.postFollowB2CCount,
    postFollowC2CCount: route.params.postFollowC2CCount,
  };
  const projectsProps = {
    queryParam: {
      ...getProjectParam({userId}),
    },
    useQuery: useGetFollowedProjectByFollowerIdLazyQuery,
    responseDataKey: 'curProjectWithPropertyPostsByFollowerId',
  };

  const propertyProps = {
    queryParam: {
      ...getPropertyParams({masterData, userId}),
    },
    responseDataKey: 'curPropertyPostsByFollowerId',
    useQuery: useGetPropertyPostsByFollowerIdLazyQuery,
  };

  const onPressProperty = item => {
    track(TrackingActions.productClicked, {
      category: Category.profile,
      click_location: ClickLocation.followedPost,
      name: item?.title ?? '',
    });
  };

  const onPressProject = item => {
    track(TrackingActions.productClicked, {
      category: Category.profile,
      click_location: ClickLocation.followedPost,
      name: item?.projectName ?? '',
      investor: item?.investorOwnerName ?? '',
    });
  };

  return (
    <PropertyWithProjectList
      unfollowStrategy={UPDATE_ITEM_STRATEGY.REMOVE_FROM_LIST}
      initialCounts={initialCounts}
      screenTitle={translate(STRINGS.PROPERTY_POST_TRACKING)}
      projectsProps={projectsProps}
      propertyProps={propertyProps}
      onPressPropertyPost={onPressProperty}
      onPressProject={onPressProject}
      isFollowing={true}
    />
  );
};

export default PropertyPostTrackingScreen;
