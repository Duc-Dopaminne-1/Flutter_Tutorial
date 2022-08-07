/* eslint-disable react-hooks/exhaustive-deps */
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SpringScrollView} from 'react-native-spring-scrollview';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {
  useGetAgentDetailForPublicLazyQuery,
  useGetCurProjectsAssignedToAgentForPublicLazyQuery,
  useGetCurPropertyPostsByAgentIdForPublicLazyQuery,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../appData/appContext/useAppContext';
import {getUserId} from '../../appData/user/selectors';
import {COMMENT_OBJECT_TYPES, EMPTY_STRING, FETCH_POLICY, ITEM_TYPE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal, small} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import BaseScreen from '../../components/BaseScreen';
import {updateSingleItem} from '../../components/LazyList';
import ProjectItem from '../../components/ProjectItem';
import PropertyItem from '../../components/PropertyItem';
import ScrollViewHeader from '../../components/ScrollViewHeader';
import {mapSearchItemUi} from '../../components/SearchProjectItem/types';
import SectionHorizontalList from '../../components/SectionHorizontalList';
import useFollowSocial from '../../hooks/useFollowSocial';
import {projectPaddingStyle} from '../../utils/RenderUtil';
import {useMount} from '../commonHooks';
import {mapProperty} from '../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../Home/useFormatPrice';
import ScreenIds from '../ScreenIds';
import {mapToAgentInfo} from './AgentInfoMapper';
import AreaList from './AreaList';
import AvatarWithInfo from './AvatarWithInfo';
import PropertyTypeList from './PropertyTypeList';
import Section from './Section.js';

const DEFAULT_ITEMS_LIMIT = 8;

const defaultAgentInfo = {
  name: '',
  groupName: '',
  agentGroupId: '',
  image: '',
  rank: {
    agentRankingName: '',
    hexColorCode: '',
  },
  rateNumber: 0,
  interestedProperties: [],
  interestedAreas: [],
  selfProperties: [],
  deliveredProperties: [],
};

const styles = StyleSheet.create({
  devider: {
    ...METRICS.horizontalMargin,
    ...METRICS.verticalMargin,
    height: 1,
    backgroundColor: COLORS.SELECTED_AREA,
  },
  areaDevider: {
    ...METRICS.horizontalMargin,
    marginTop: small,
    marginBottom: 12,
    height: 1,
    backgroundColor: COLORS.SELECTED_AREA,
  },
  sectionText: {
    ...HELPERS.fill,
    ...FONTS.semiBold,
    fontSize: 15,
  },
  textRefCode: {
    fontSize: 14,
    ...FONTS.regular,
    color: COLORS.PRIMARY_A100,
  },
  textContent: {fontSize: 14, ...FONTS.regular},
  viewAgentCode: {flexDirection: 'row', marginHorizontal: 16},
  viewFollowInfo: {
    height: 60,
    backgroundColor: COLORS.BACKGROUND,
    flexDirection: 'row',
    marginTop: normal,
    borderRadius: small,
  },
  line: {width: 1, backgroundColor: COLORS.GREY_F0, marginVertical: small},
  infoBlock: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  textServiceType: {
    ...FONTS.regular,
    fontSize: 14,
    marginHorizontal: normal,
  },
});

export const AgentManagerContainer = ({
  scrollRef,
  onRefresh,
  agentInfo,
  // agentTitle,
  onPressReferralUser,
  navigation,
  agentId,
  formatPrice,
  updateProperty,
  propertyData,
  updateProject,
  projectData,
  followInfo,
  onPressFollow,
}) => {
  const getPropsForRent = item => {
    return {
      showForRentBanner: true,
      showPriceDetailForRent: !item?.forSale,
      isShowStatus: true,
    };
  };

  const isShowRefInfo = agentInfo?.referralUser?.fullName;
  const topenerServiceTypes = agentInfo?.topenerServiceTypes;

  const onPressProperty = postInfo => {
    navigation.navigate(ScreenIds.ViewPropertyPost, {
      propertyPostId: postInfo?.propertyPostId ?? '',
      viewByOtherMode: true,
    });
  };

  const onPressProject = projectInfo => {
    navigation.navigate(ScreenIds.ProjectDetail, {
      projectId: projectInfo.projectId,
    });
  };

  return (
    <SpringScrollView
      keyboardShouldPersistTaps="always"
      ref={scrollRef}
      onRefresh={onRefresh}
      refreshHeader={ScrollViewHeader}>
      <View style={{backgroundColor: COLORS.NEUTRAL_WHITE}}>
        <View style={[METRICS.horizontalMargin, METRICS.verticalPadding]}>
          <AvatarWithInfo
            isFollow={followInfo?.currentUserFollowFeedItem}
            agentInfo={agentInfo}
            onPressFollow={onPressFollow}
          />
          <View style={styles.viewFollowInfo}>
            <View style={styles.infoBlock}>
              <Text style={{...FONTS.bold}}>{followInfo?.totalFollower}</Text>
              <Text style={{color: COLORS.GRAY_A3}}>{translate('social.follower')}</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.infoBlock}>
              <Text style={{...FONTS.bold}}>{followInfo?.totalFollowing}</Text>
              <Text style={{color: COLORS.GRAY_A3}}>{translate('social.following')}</Text>
            </View>
          </View>
        </View>
        <View style={styles.viewAgentCode}>
          <View style={{...HELPERS.fill}}>
            <Text style={{...FONTS.regular, color: COLORS.BRAND_GREY}}>
              {translate('agent.agentCode')}
            </Text>
            {/* <Text style={{...FONTS.regular, color: COLORS.BRAND_GREY, marginVertical: small}}>
              {agentTitle}
            </Text> */}
            {isShowRefInfo && (
              <Text style={{...FONTS.regular, color: COLORS.BRAND_GREY}}>
                {translate('agent.referral')}
              </Text>
            )}
          </View>
          <View style={{...HELPERS.fill}}>
            <Text style={styles.textContent}>{agentInfo.agentCode}</Text>
            {/* <Text style={[styles.textContent, {marginVertical: small}]}>{agentInfo.groupName}</Text> */}
            {isShowRefInfo && (
              <TouchableOpacity onPress={onPressReferralUser}>
                <Text style={styles.textRefCode}>{agentInfo?.referralUser?.fullName || ''}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {topenerServiceTypes?.length > 0 && (
          <>
            <View style={styles.areaDevider} />
            <Section sectionName={translate('agent.topenerServiceTypes')}>
              {topenerServiceTypes.map(item => (
                <Text style={styles.textServiceType} key={item.requestTypeName}>
                  {'• ' + item.requestTypeDescription}
                </Text>
              ))}
            </Section>
          </>
        )}
        <View style={styles.areaDevider} />
        <Section sectionName={translate('agent.properyInterested')}>
          <PropertyTypeList propertiesList={agentInfo.interestedProperties} />
        </Section>
        <View style={styles.devider} />
        <Section sectionName={translate(STRINGS.INTERESTED_AREA)}>
          <AreaList areaList={agentInfo.interestedAreas} />
        </Section>
      </View>
      <SectionHorizontalList
        titleStyle={styles.sectionText}
        title={translate(STRINGS.AGENT_PROPERTY_POST)}
        onViewMore={() => navigation.navigate(ScreenIds.AgentProperty, {agentId})}
        renderItem={({item, index}) => {
          const propertyInfo = mapProperty(item, formatPrice);
          const otherPropsForRent = getPropsForRent(item);
          return (
            <PropertyItem
              onPress={onPressProperty}
              actions={{
                updateItem: updateProperty,
              }}
              isHorizontal
              {...propertyInfo}
              {...otherPropsForRent}
              style={projectPaddingStyle(index)}
              showBrokenInfo={false}
            />
          );
        }}
        items={propertyData.items}
        dataError={propertyData.error}
        loading={propertyData.loading}
        error={propertyData.graphQlError}
        keyExtractor={item => `${item.propertyPostId}`}
        totalItemCount={propertyData.totalCount}
        maxRenderItemCount={DEFAULT_ITEMS_LIMIT}
      />
      <SectionHorizontalList
        titleStyle={styles.sectionText}
        title={translate(STRINGS.DELIVERED_PROPERTY)}
        onViewMore={() => navigation.navigate(ScreenIds.ProjectDelivered, {agentId})}
        renderItem={({item, index}) => {
          const mapItem = mapSearchItemUi(item, formatPrice);
          return (
            <ProjectItem
              projectInfo={mapItem}
              actions={{
                updateItem: updateProject,
              }}
              onPress={onPressProject}
              style={projectPaddingStyle(index)}
              itemType={ITEM_TYPE.small}
            />
          );
        }}
        items={projectData.items}
        dataError={projectData.error}
        loading={projectData.loading}
        error={projectData.graphQlError}
        keyExtractor={item => `${item.projectId}`}
        totalItemCount={projectData.totalCount}
        maxRenderItemCount={DEFAULT_ITEMS_LIMIT}
      />
      <View style={commonStyles.separatorRow16} />
    </SpringScrollView>
  );
};

const extractError = response => {
  if (response) {
    return response.errorMessage || response.errorCode || response.errorMessageCode;
  }
  return EMPTY_STRING;
};

const useQueryListData = ({
  useQuery,
  queryParams,
  extractTotal,
  extractData,
  uniqueKey,
  processItemsResponse,
}) => {
  const [execute, {data, loading, error: graphQlError}] = useQuery({
    ...FETCH_POLICY.NETWORK_ONLY,
    notifyOnNetworkStatusChange: true,
  });
  const [items, setItems] = useState([]);
  const [error, setError] = useState(EMPTY_STRING);
  const [totalCount, setTotalCount] = useState(0);

  const callApi = () => {
    execute({variables: {...queryParams}});
  };

  const updateItem = item => {
    const temps = updateSingleItem(item, items, uniqueKey);
    setItems(temps);
  };

  useEffect(() => {
    if (data) {
      const errorMessage = extractError(data);
      if (!isEmpty(errorMessage)) {
        setError(errorMessage);
        return;
      }
      const temps = extractData(data);
      const total = extractTotal(data);
      setTotalCount(total);
      if (isEmpty(temps)) {
        return;
      }
      processItemsResponse ? setItems(processItemsResponse(temps)) : setItems(temps);
    }
  }, [data]);

  return [callApi, updateItem, {totalCount, loading, items, error, graphQlError}];
};

const getQueryOptions = (variables, onCompleted = () => {}) => {
  return {
    // variables,
    onCompleted,
    ...FETCH_POLICY.CACHE_AND_NETWORK,
  };
};

const processPropertiesData = data => {
  return data.map(it => ({
    ...(it?.node || {}),
    images: it.node?.images,
  }));
};

const initialState = {
  properties: [],
  projects: [],
  agentInfo: defaultAgentInfo,
};

const AgentManagementScreen = ({navigation, route}) => {
  const {agentId, onBackAction} = route?.params || {};
  const buyerId = useSelector(getUserId);
  const isMyProfile = agentId === buyerId;
  const [{properties, projects, agentInfo}, setScreenData] = useState(initialState);
  const scrollRef = useRef(null);
  const {showErrorAlert} = useContext(AppContext);
  const {formatPrice} = useFormatPrice();
  const endLoading = () => scrollRef.current?.endRefresh();

  const onGetDetailSuccess = agentDetail => {
    if (agentDetail) {
      const info = mapToAgentInfo(agentDetail);
      setScreenData({properties, projects, agentInfo: info});
    }
  };

  const onGetDetailError = error => {
    endLoading();
    showErrorAlert(error.message);
  };

  const agentDetailOptions = getQueryOptions({}, endLoading);
  const {startApi: getAgentDetail} = useGraphqlApiLazy({
    graphqlApiLazy: useGetAgentDetailForPublicLazyQuery,
    queryOptions: agentDetailOptions,
    dataField: 'agentByIdForPublic',
    onSuccess: onGetDetailSuccess,
    onError: onGetDetailError,
  });

  const [getProperties, updateProperty, propertyData] = useQueryListData({
    useQuery: useGetCurPropertyPostsByAgentIdForPublicLazyQuery,
    queryParams: {
      agentId: agentId,
      first: DEFAULT_ITEMS_LIMIT,
      after: EMPTY_STRING,
      where: null,
    },
    extractData: response => response?.curPropertyPostsByAgentIdForPublic?.edges ?? [],
    extractTotal: response => response?.curPropertyPostsByAgentIdForPublic?.totalCount ?? 0,
    uniqueKey: 'propertyPostId',
    processItemsResponse: processPropertiesData,
  });

  const {followInfo, onFollowTopener} = useFollowSocial({
    feedObjectId: agentId,
    feedObjectTypeId: COMMENT_OBJECT_TYPES.TOPENER,
    onFollowTopenerSuccess: () => {
      onBackAction && onBackAction();
    },
  });

  const [getProjects, updateProject, projectData] = useQueryListData({
    useQuery: useGetCurProjectsAssignedToAgentForPublicLazyQuery,
    queryParams: {
      agentId: agentId,
      first: DEFAULT_ITEMS_LIMIT,
      after: EMPTY_STRING,
      where: null,
    },
    extractData: response => response?.curProjectsAssignedToAgentForPublic?.edges ?? [],
    extractTotal: response => response?.curProjectsAssignedToAgentForPublic?.totalCount ?? 0,
    uniqueKey: 'projectId',
    processItemsResponse: data =>
      data.map(item => ({
        ...(item?.node || {}),
      })),
  });

  const onPressFollow = () => {
    onFollowTopener({
      feedObjectTitle: agentInfo?.name,
    });
  };

  const fetchAllData = () => {
    getAgentDetail({variables: {agentId}});
    getProperties();
    getProjects();
  };

  const onPressReferralUser = () => {
    if (agentInfo?.referralUser?.userId) {
      navigation.push(ScreenIds.AgentManagement, {
        agentId: agentInfo?.referralUser?.userId,
      });
    }
  };

  useMount(fetchAllData);
  const onRefresh = () => fetchAllData();

  const agentTitle = agentInfo.isAgentLeader
    ? translate('AGENT_LEADER')
    : translate('AGENT_MEMBER');

  const title = isMyProfile ? translate('profile.myProfile') : translate('profile.agentProfile');

  return (
    <BaseScreen showHeaderShadow title={title}>
      <AgentManagerContainer
        scrollRef={scrollRef}
        onRefresh={onRefresh}
        agentInfo={agentInfo}
        agentTitle={agentTitle}
        onPressFollow={onPressFollow}
        onPressReferralUser={onPressReferralUser}
        navigation={navigation}
        agentId={agentId}
        followInfo={followInfo}
        formatPrice={formatPrice}
        updateProperty={updateProperty}
        propertyData={propertyData}
        updateProject={updateProject}
        projectData={projectData}
      />
    </BaseScreen>
  );
};

export default AgentManagementScreen;
