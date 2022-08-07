import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {LargeList} from 'react-native-largelist-v3';
import {useSelector} from 'react-redux';

import {useInviteUserActiveLazyQuery} from '../../../api/graphql/generated/graphql';
import {parseGraphqlError} from '../../../api/graphql/parseGraphqlError';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {getUserId} from '../../../appData/user/selectors';
import {FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {tiny} from '../../../assets/theme/metric';
import BaseScreen from '../../../components/BaseScreen';
import CenterText from '../../../components/CenterText';
import ScrollViewFooter from '../../../components/ScrollViewFooter';
import ScrollViewHeader from '../../../components/ScrollViewHeader';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import ItemInvitedUser, {getHeightForMemberItem} from './ItemInvitedUser';

const styles = StyleSheet.create({
  flatList: {
    marginTop: tiny,
  },
});

const DEFAULT_SECTION = 0;

const PAGE_SIZE = 20;
const START_PAGE = 1;

const getListItemWithHeight = async items => {
  const list = [];
  for (let i = 0; i < items.length; i++) {
    const height = await getHeightForMemberItem(items[i]);
    list.push({
      ...items[i],
      height: height,
    });
  }
  return list;
};

const CenterMessage = ({loading, handlingResponse, isFirstLoad, data}) => {
  const isLoadingOrRendering = loading || handlingResponse;
  const shouldShowCenterText =
    (isLoadingOrRendering && isFirstLoad) || (!isLoadingOrRendering && isEmpty(data));
  if (shouldShowCenterText) {
    return <CenterText loading={loading || handlingResponse} />;
  }
  return null;
};

const renderItem = ({row, dataList}) => {
  const item = dataList[DEFAULT_SECTION].items[row];
  const needShowSeparator = row < dataList[DEFAULT_SECTION].items.length - 1;
  return <ItemInvitedUser item={item} needShowSeparator={needShowSeparator} />;
};

const ListInviteActiveUser = ({navigation, route}) => {
  const {numberOfMember} = route?.params || {};
  const userId = useSelector(getUserId);
  const [page, setPage] = useState(START_PAGE);
  const {showErrorAlert} = useContext(AppContext);
  const listRef = useRef(null);
  const [dataList, setDataList] = useState([{items: []}]);
  const [handlingResponse, setHandlingResponse] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const onCompleted = () => {
    listRef.current?.endLoading(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
    listRef.current?.endRefresh(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
  };

  const [execute, {loading, error, data, networkStatus, refetch}] = useInviteUserActiveLazyQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: onCompleted,
    ...FETCH_POLICY.CACHE_AND_NETWORK,
  });

  useMount(() => {
    execute({
      variables: {
        pageSize: PAGE_SIZE,
        page: page,
        userId: userId,
      },
    });
  });

  useEffect(() => {
    if (!loading && !handlingResponse) {
      listRef.current?.endLoading(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
      listRef.current?.endRefresh(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
    }
    if (error) {
      const errorMessage = parseGraphqlError(error);
      showErrorAlert(errorMessage);
      setIsFirstLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, networkStatus]);

  const onRefresh = () => {
    setPage(START_PAGE);
    refetch();
  };

  // const onLoadMore = () => {
  //   const newPage = page; // TODO: load more item;
  //   setPage(newPage);
  //   fetchMore({
  //     variables: {page: newPage},
  //     updateQuery: (prev, {fetchMoreResult}) => {
  //       if (!fetchMoreResult) {
  //         return prev;
  //       }
  //       return {
  //         inviteUserActive: {
  //           edges: [...prev.inviteUserActive.edges, ...fetchMoreResult.inviteUserActive.edges],
  //         },
  //       };
  //     },
  //   });
  // };

  const getItemHeight = ({row}) => {
    return dataList[DEFAULT_SECTION].items[row].height ?? 0;
  };

  useEffect(() => {
    if (data) {
      (async () => {
        setHandlingResponse(true);
        const rawItems = data?.inviteUserActive?.edges ?? [];
        const items = await getListItemWithHeight(rawItems);
        setDataList([{items}]);
        setHandlingResponse(false);
        setIsFirstLoad(false);
      })();
    }
  }, [data]);

  const allLoaded = dataList[DEFAULT_SECTION].items.length >= numberOfMember;

  return (
    <BaseScreen title={translate('shareScreen.titleListMember')} testID={ScreenIds.YourTeamDetail}>
      {CenterMessage({
        loading,
        handlingResponse,
        isFirstLoad,
        data: dataList[DEFAULT_SECTION].items,
      })}
      <LargeList
        ref={listRef}
        renderSection={() => null}
        heightForIndexPath={getItemHeight}
        renderIndexPath={({row}) => renderItem({row, dataList, navigation})}
        refreshHeader={ScrollViewHeader}
        loadingFooter={ScrollViewFooter}
        onRefresh={onRefresh}
        // onLoading={onLoadMore}
        data={dataList}
        style={styles.flatList}
        allLoaded={allLoaded}
      />
    </BaseScreen>
  );
};

export default ListInviteActiveUser;
