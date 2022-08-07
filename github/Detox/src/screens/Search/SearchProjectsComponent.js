import {useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import React from 'react';

import {useSearchProjectsLazyQuery} from '../../api/graphql/generated/graphql';
import {ITEM_TYPE} from '../../assets/constants';
import LazyList, {PAGING_TYPE} from '../../components/LazyList';
import ProjectItem, {ProjectItemHeight} from '../../components/ProjectItem';
import {mapSearchItemUi} from '../../components/SearchProjectItem/types';
import {extractAddressData} from '../../utils/DataProcessUtil';
import {getPropertyTypeDescriptionById} from '../../utils/GetMasterData';
import SearchDataUtils from '../../utils/SearchDataUtils';
import {useFormatPrice} from '../Home/useFormatPrice';
import ScreenIds from '../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../WithSegment';

const START_PAGE = 1;

const SearchProjectsComponent = ({state, isNewRouter = false, setState, masterData}) => {
  const navigation = useNavigation();
  const navigationType = isNewRouter ? navigation.push : navigation.navigate;
  const {track} = useAnalytics();
  const searchCriteria = state.searchCriteria;
  const {formatPrice} = useFormatPrice();
  const renderProject = ({item, ...otherProps}) => {
    const mappingItem = mapSearchItemUi(item, formatPrice);
    const onPressItem = () => {
      track(TrackingActions.productClicked, {
        category: Category.project,
        click_location: ClickLocation.home,
        investor: mappingItem?.investorOwnerName,
        name: mappingItem?.projectName,
        address: mappingItem?.projectAddress,
        price: item?.minPrice,
        commission: mappingItem?.commissionRates,
        image_url: mappingItem?.featurePhotos,
        start_year: mappingItem?.start_year,
      });
      navigationType(ScreenIds.ProjectDetail, {
        projectId: item.projectId,
      });
    };

    const onFollowSuccess = () => {
      track(TrackingActions.productFollowClicked, {
        click_location: ClickLocation.productListPage,
        category: Category.project,
        name: mappingItem?.projectName ?? '',
        property_type:
          getPropertyTypeDescriptionById(masterData, mappingItem?.propertyTypeId) ?? '',
        investor: mappingItem?.investorOwnerName ?? '',
      });
    };

    return (
      <ProjectItem
        {...otherProps}
        onPress={onPressItem}
        projectInfo={mappingItem}
        itemType={ITEM_TYPE.full}
        onFollowSuccess={onFollowSuccess}
      />
    );
  };

  const querySetting = {
    queryParams: {
      input: SearchDataUtils.mappingSearchProjects(
        searchCriteria,
        START_PAGE,
        searchCriteria.projectOrderBy,
      ),
    },
    useQuery: useSearchProjectsLazyQuery,
    responseDataKey: 'searchProjects',
    responseDataArrayKey: 'projectInfoDtos',
  };

  const onDataChange = ({totalCount, items}) => {
    setState({...state, b2cPostsCount: totalCount ?? 0, items});
  };

  const onDoneGetProjects = projects => {
    track(TrackingActions.productsListViewed, {
      category: Category.project,
      projects: projects?.map(e => ({
        name: e?.projectName,
        address: extractAddressData(e.projectAddress, false, true),
        commission: e?.commissionRates,
        price: e?.minPrice,
        image_url: e?.featurePhotos,
        project_area: e?.totalArea,
      })),
    });
  };

  return (
    <LazyList
      renderItem={({item, index, ...otherProps}) =>
        renderProject({item, index, navigation, ...otherProps})
      }
      useQuery={querySetting.useQuery}
      queryOptions={{
        variables: {
          ...querySetting.queryParams,
        },
      }}
      itemHeight={ProjectItemHeight}
      uniqueKey={'projectId'}
      extractArray={response => response?.searchProjects?.projectInfoDtos ?? []}
      extractTotalCount={response => response?.searchProjects?.totalCount ?? 0}
      onDataChange={onDataChange}
      pagingType={PAGING_TYPE.OFFSET}
      onQueryCompleted={onDoneGetProjects}
    />
  );
};

export default SearchProjectsComponent;
