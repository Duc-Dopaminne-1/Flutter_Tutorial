import {useNavigation} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {
  useDeleteFollowerOfCurrentUserForFrontOfficeMutation,
  useFollowFeedItemMutation,
  useGetTopenersByCurrentUserForFrontOfficeLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {COMMENT_OBJECT_TYPES, DEFAULT_PAGE_SIZE, SORT_ORDER} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {medium, normal} from '../../../assets/theme/metric';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import {getCommentObjectType} from '../../../utils/GetMasterData';
import JsonDataUtils from '../../../utils/JsonDataUtils';
import ScreenIds from '../../ScreenIds';
import SearchHeader from '../../Search/components/SearchHeader';
import FollowerItem from './FollowerItem';
import ModalFilterListFollower from './ModalFilter';

const style = StyleSheet.create({
  viewOption: {flexDirection: 'row', alignItems: 'center'},
  searchHeader: {marginLeft: normal, zIndex: 999},
});

const initState = {
  cityId: null,
  districtId: null,
  orderBy: null,
  keyword: null,
  sort: null,
};

const ListFollowItem = ({
  item,
  onPressfollow,
  onPressMoreOptions,
  type,
  navigation,
  onPressDetailAgent,
}) => {
  return (
    <FollowerItem
      item={item}
      onPressFollow={() => onPressfollow(item)}
      type={type}
      onPress={() => onPressDetailAgent(item)}
      onPressMoreOptions={onPressMoreOptions}
      navigation={navigation}
    />
  );
};

const FollowerList = ({type}) => {
  const modalFilterRef = React.useRef(null);
  const modalOptionrRef = React.useRef(null);
  const itemSelected = React.useRef(null);
  const [filterState, setFilterState] = useState(initState);
  const navigation = useNavigation();
  const {getMasterData, showAppModal} = useContext(AppContext);
  const masterData = getMasterData();
  const {typeId} = getCommentObjectType(masterData, COMMENT_OBJECT_TYPES.TOPENER);
  const [updateRefresh, setUpdateRefresh] = useState();
  const queryParams = {
    input: JsonDataUtils.deleteEmptyDataFiled({
      cityId: filterState.cityId,
      districtId: filterState.districtId,
      type: type,
      fullName: filterState.keyword,
    }),
    orderBy: {
      createdDatetime: filterState.sort ?? SORT_ORDER.DESC,
    },
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };

  const {startApi} = useMutationGraphql({
    showSpinner: false,
    graphqlApiLazy: useFollowFeedItemMutation,
  });

  const {startApi: startApiDeleteFollower} = useMutationGraphql({
    showSpinner: false,
    graphqlApiLazy: useDeleteFollowerOfCurrentUserForFrontOfficeMutation,
  });

  const followTopener = (item, isFollow) => {
    startApi(
      {
        variables: {
          input: {
            feedObjectId: item?.userId,
            feedObjectTypeId: typeId,
            feedObjectTitle: item?.fullName,
            isFollowFeedItem: isFollow,
          },
        },
      },
      () => {
        onRefresh(item?.userId);
      },
    );
  };

  const onOkHandler = item => {
    followTopener(item, false);
  };

  const onPressfollow = item => {
    if (item.isFollow) {
      const name = item?.fullName;
      showAppModal({
        isVisible: true,
        title: translate('social.unFollow'),
        message: translate('social.titleUnFollow', {name}),
        cancelText: translate(STRINGS.CLOSE),
        okText: translate(STRINGS.AGREE),
        onOkHandler: () => onOkHandler(item),
      });
    } else {
      followTopener(item, true);
    }
  };

  const onPressDetailAgent = item => {
    if (!isEmpty(item?.agentRankingName)) {
      navigation.navigate(ScreenIds.AgentManagement, {
        agentId: item?.userId,
        onBackAction: () => setUpdateRefresh(Math.random()),
      });
    }
  };

  const onChangeFilter = (key, value) => {
    setFilterState({...filterState, [key]: value});
  };

  const applyFilterFollower = data => {
    setFilterState(data);
  };

  const onOkCancelFollow = item => {
    startApiDeleteFollower(
      {
        variables: {
          input: {
            agentId: item?.userId,
          },
        },
      },
      () => {
        itemSelected.current = null;
        onRefresh(item?.userId);
      },
    );
  };

  const onPressUnfollow = () => {
    modalOptionrRef?.current?.close();
    const itemSelect = itemSelected.current;
    const name = itemSelect?.fullName;
    setTimeout(() => {
      showAppModal({
        isVisible: true,
        title: translate('social.deleteFollowTitle'),
        message: translate('social.deleteFollow', {name}),
        cancelText: translate(STRINGS.CLOSE),
        okText: translate(STRINGS.AGREE),
        onOkHandler: () => onOkCancelFollow(itemSelect),
      });
    }, 500);
  };

  const onRefresh = id => {
    setUpdateRefresh(id);
  };

  const onPressMoreOptions = item => {
    itemSelected.current = item;
    modalOptionrRef?.current?.open();
  };
  return (
    <>
      <SearchHeader
        renderLeft={false}
        placeholder={translate('social.list.placeHolder')}
        style={style.searchHeader}
        onFilterPress={() => modalFilterRef?.current?.open()}
        onChangeKeyword={e => onChangeFilter('keyword', e)}
      />
      <LazyList
        shouldRefresh={updateRefresh}
        separatorHeight={0}
        renderItem={({item}) => {
          return (
            <ListFollowItem
              item={item}
              onPressfollow={onPressfollow}
              onPressMoreOptions={() => onPressMoreOptions(item)}
              type={type}
              navigation={navigation}
              onPressDetailAgent={onPressDetailAgent}
            />
          );
        }}
        extractTotalCount={response =>
          response?.getTopenersByCurrentUserForFrontOffice?.totalCount || 0
        }
        useQuery={useGetTopenersByCurrentUserForFrontOfficeLazyQuery}
        queryOptions={{variables: {...queryParams}}}
        extractArray={response => response?.getTopenersByCurrentUserForFrontOffice?.edges || []}
        pagingType={PAGING_TYPE.OFFSET_VARIABLES}
      />
      <ModalFilterListFollower
        initState={initState}
        filterData={filterState}
        applyFilterFollower={applyFilterFollower}
        ref={modalFilterRef}
      />
      <ModalWithModalize withReactModal getModalRef={modalOptionrRef}>
        <View style={{padding: normal, paddingVertical: medium}}>
          <TouchableOpacity
            onPress={onPressUnfollow}
            style={[style.viewOption, {marginBottom: normal}]}>
            <Icon size={20} name={'ban'} />
            <Text style={{marginLeft: normal}}>{translate('social.unFollow')}</Text>
          </TouchableOpacity>
        </View>
      </ModalWithModalize>
    </>
  );
};

export default FollowerList;
