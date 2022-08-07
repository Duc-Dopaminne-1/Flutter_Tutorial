import {useAnalytics} from '@segment/analytics-react-native';
import React from 'react';
import {useSelector} from 'react-redux';

import {useGetProjectByCurrentUserLazyQuery} from '../../../api/graphql/generated/graphql';
import {getUserId} from '../../../appData/user/selectors';
import {ITEM_TYPE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import BaseScreen from '../../../components/BaseScreen';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import ProjectItem, {ProjectItemHeight} from '../../../components/ProjectItem';
import {mapSearchItemUi} from '../../../components/SearchProjectItem/types';
import {mapIsFollowedIntoItem} from '../../../utils/MapDataUtils';
import {useFormatPrice} from '../../Home/useFormatPrice';
import ScreenIds from '../../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';
import {useGetFollowProjectIds} from '../hooks/useGetFollowProjectIds';

const ProjectDeliveredScreen = ({navigation}) => {
  const {track} = useAnalytics();
  const userId = useSelector(getUserId);

  const {formatPrice} = useFormatPrice();
  const {fetchFollowProjectIds, listFollowProjectIds} = useGetFollowProjectIds({});
  const querySetting = {
    queryParam: {userId},
    useQuery: useGetProjectByCurrentUserLazyQuery,
    responseDataKey: 'projectWithPropertyPostsByUserId',
  };

  const onQueryCompleted = (newItems: [{projectId: string}]) => {
    if (newItems && newItems.length) {
      const projectIds = newItems.map(item => item.projectId);
      fetchFollowProjectIds(projectIds);
    }
  };

  const renderItem = (item, otherProps) => {
    const mappingItem = mapSearchItemUi(item, formatPrice);
    const onPressItem = () => {
      track(TrackingActions.productClicked, {
        click_location: ClickLocation.readyForSale,
        category: Category.profile,
        name: item?.projectName,
        investor: item?.investorOwnerName,
      });

      navigation.navigate(ScreenIds.ProjectDetail, {
        projectId: item.projectId,
      });
    };

    const onFollowSuccess = () => {
      track(TrackingActions.productFollowClicked, {
        click_location: ClickLocation.readyForSale,
        category: Category.profile,
        name: mappingItem?.projectName,
        investor: mappingItem?.investorOwnerName,
      });
    };

    return (
      <ProjectItem
        onPress={onPressItem}
        {...otherProps}
        itemType={ITEM_TYPE.full}
        projectInfo={mappingItem}
        onFollowSuccess={onFollowSuccess}
      />
    );
  };

  const mapUpdatedItems = listItems => {
    return mapIsFollowedIntoItem({
      listFollowIds: listFollowProjectIds,
      listItems,
      keyId: 'projectId',
    });
  };

  return (
    <BaseScreen title={translate(STRINGS.PROPERTY_POST_DELIVERED)}>
      <LazyList
        renderItem={({item, index, ...otherProps}) => renderItem(item, otherProps)}
        useQuery={querySetting.useQuery}
        pagingType={PAGING_TYPE.OFFSET_VARIABLES}
        queryOptions={{
          variables: {
            ...querySetting.queryParam,
          },
        }}
        updatedItemIds={listFollowProjectIds}
        mapUpdatedItems={mapUpdatedItems}
        onQueryCompleted={onQueryCompleted}
        itemHeight={ProjectItemHeight}
        extractArray={response => response[querySetting.responseDataKey]?.edges ?? []}
        uniqueKey={'projectId'}
      />
    </BaseScreen>
  );
};

export default ProjectDeliveredScreen;
