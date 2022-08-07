import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {View} from 'react-native';

import {AppContext} from '../../appData/appContext/useAppContext';
import {ITEM_TYPE, POST_TYPE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {METRICS} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import CustomTabView, {TAB_TYPE} from '../../components/CustomTabView';
import CustomTotalCount from '../../components/CustomTotalCount';
import LazyList, {PAGING_TYPE} from '../../components/LazyList';
import ProjectItem, {ProjectItemHeight} from '../../components/ProjectItem';
import PropertyItemGuarantee, {
  getGuaranteedStatusStyle,
  ItemHeight,
} from '../../components/PropertyItem/PropertyItemGuarantee';
import {mapSearchItemUi} from '../../components/SearchProjectItem/types';
import {searchProjectDtoMapper} from '../../utils/DataProcessUtil';
import {getPropertyPostApprovalStatusDescriptionById} from '../../utils/GetMasterData';
import {mapIsFollowedIntoItem} from '../../utils/MapDataUtils';
import {projectPaddingStyle} from '../../utils/RenderUtil';
import {mapPropertyC2CGuarantee} from '../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../Home/useFormatPrice';
import ScreenIds from '../ScreenIds';
import {useGetFollowProjectIds} from './hooks/useGetFollowProjectIds';
import {useGetFollowPropertyIds} from './hooks/useGetFollowPropertyIds';
import PropertyPostUtils from './PropertyPostUtils';

const PropertyWithProjectList = ({
  screenTitle,
  projectsProps,
  propertyProps,
  isFollowing = false,
  onPressPropertyPost,
  onPressProject,
}) => {
  const navigation = useNavigation();
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const {formatPrice} = useFormatPrice();
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [selectedTab, setSelectedTab] = useState(POST_TYPE.B2C);
  const routes = [
    {key: POST_TYPE.B2C, title: translate('managePost.followPost.tabHeaderOne')},
    {key: POST_TYPE.C2C, title: translate('managePost.followPost.tabHeaderTwo')},
  ];
  const {fetchFollowProjectIds, listFollowProjectIds} = useGetFollowProjectIds({});
  const {fetchFollowPropertyIds, listFollowPropertyIds} = useGetFollowPropertyIds();

  const onPropertiesDataChange = ({totalCount}) => {
    setTotalProperties(totalCount);
  };

  const onProjectsDataChange = ({totalCount}) => {
    setTotalProjects(totalCount);
  };

  const getPropsForRent = item => {
    const statusText = getPropertyPostApprovalStatusDescriptionById(
      masterData,
      item?.propertyPostApprovalStatusId,
    );
    if (isFollowing) {
      return {
        showForRentBanner: false,
        showPriceDetailForRent: !item?.forSale,
        status: statusText,
      };
    }

    return null;
  };

  const renderPropertyPost = props => {
    const item = {
      ...mapPropertyC2CGuarantee(props.item, formatPrice, false),
      ...getPropsForRent(props.item),
      isShowStatus: true,
    };

    const onPressProduct = () => {
      onPressPropertyPost && onPressPropertyPost(item);

      navigation.navigate(ScreenIds.ViewPropertyPost, {
        propertyPostId: item?.propertyPostId,
        viewByOtherMode: true,
      });
    };

    return (
      <PropertyItemGuarantee
        {...props}
        onPress={onPressProduct}
        {...item}
        showBrokenInfo={false}
        style={projectPaddingStyle(props.index, false)}
        itemType={ITEM_TYPE.full}
        {...getGuaranteedStatusStyle({item: props.item, masterData})}
      />
    );
  };

  const renderProjects = props => {
    const mappingItem = mapSearchItemUi(props.item, formatPrice);

    const onPressProduct = () => {
      onPressProject && onPressProject(mappingItem);

      navigation.navigate(ScreenIds.ProjectDetail, {
        projectId: mappingItem.projectId,
      });
    };

    return (
      <ProjectItem
        itemType={ITEM_TYPE.full}
        onPress={onPressProduct}
        {...props}
        projectInfo={mappingItem}
      />
    );
  };

  const getQuerySettingsByRoute = route => {
    const {useQuery, queryParam, responseDataKey} =
      route.key === POST_TYPE.C2C ? propertyProps : projectsProps;

    const onQueryCompleted = (newItems: [{projectId: string}]) => {
      if (newItems && newItems.length) {
        if (route.key === POST_TYPE.C2C) {
          const propertyIds = newItems.map(item => item.propertyPostId);
          fetchFollowPropertyIds(propertyIds);
        } else {
          const projectIds = newItems.map(item => item.projectId);
          fetchFollowProjectIds(projectIds);
        }
      }
    };

    const mapUpdatedItems = listItems => {
      if (route.key === POST_TYPE.C2C) {
        return mapIsFollowedIntoItem({
          listFollowIds: listFollowPropertyIds,
          listItems,
          keyId: 'propertyPostId',
        });
      }
      return mapIsFollowedIntoItem({
        listFollowIds: listFollowProjectIds,
        listItems,
        keyId: 'projectId',
      });
    };
    const baseSettings = {
      useQuery,
      queryOptions: {
        variables: {
          ...queryParam,
        },
      },
      extractArray: response => response?.[responseDataKey].edges ?? [],
      extractTotalCount: response => response?.[responseDataKey].totalCount ?? [],
      mapUpdatedItems,
      onQueryCompleted,
    };

    if (route.key === POST_TYPE.C2C) {
      return {
        ...baseSettings,
        renderItem: renderPropertyPost,
        itemHeight: item => ItemHeight({item: item.node, isShowBroker: false}),
        uniqueKey: 'propertyPostId',
        onDataChange: onPropertiesDataChange,
        mapToUiModel: PropertyPostUtils.mapPropertyItem,
        updatedItemIds: listFollowPropertyIds,
      };
    }
    return {
      ...baseSettings,
      renderItem: renderProjects,
      itemHeight: ProjectItemHeight,
      uniqueKey: 'projectId',
      onDataChange: onProjectsDataChange,
      mapToUiModel: item => searchProjectDtoMapper(item.node, masterData),
      updatedItemIds: listFollowProjectIds,
    };
  };

  const renderScene = ({route}) => {
    const querySettings = getQuerySettingsByRoute(route);
    return (
      <>
        <View style={METRICS.marginTop} />
        <LazyList {...querySettings} pagingType={PAGING_TYPE.CURSOR} />
      </>
    );
  };
  const onChangeTab = ({key}) => {
    setSelectedTab(key);
  };

  return (
    <BaseScreen title={screenTitle}>
      <CustomTabView
        type={TAB_TYPE.PRIMARY_ORANGE}
        routes={routes}
        onIndexChange={onChangeTab}
        renderScene={renderScene}
        childComponent={
          <CustomTotalCount
            count={selectedTab === POST_TYPE.B2C ? totalProjects : totalProperties}
            message={translate(
              selectedTab === POST_TYPE.B2C
                ? 'project.foundProject'
                : 'yourPropertyPost.postedProduct',
            )}
          />
        }
      />
    </BaseScreen>
  );
};

PropertyWithProjectList.propTypes = {
  screenTitle: PropTypes.string.isRequired,
  projectsProps: PropTypes.shape({
    queryParam: PropTypes.object,
    useQuery: PropTypes.func,
    responseDataKey: PropTypes.string,
    updatedItem: PropTypes.object,
  }),
  propertyProps: PropTypes.shape({
    filter: PropTypes.object,
    queryParam: PropTypes.object,
    responseDataKey: PropTypes.string,
    useQuery: PropTypes.func,
    updatedItem: PropTypes.object,
  }),
};

export default PropertyWithProjectList;
