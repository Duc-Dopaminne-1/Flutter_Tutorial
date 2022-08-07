import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {LargeList} from 'react-native-largelist-v3';

import {useGetCustomerInfoChangeHistoriesForFoLazyQuery} from '../../../api/graphql/generated/graphql';
import {parseGraphqlError} from '../../../api/graphql/parseGraphqlError';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {FETCH_POLICY} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, tiny} from '../../../assets/theme/metric';
import BaseScreen from '../../../components/BaseScreen';
import CenterText from '../../../components/CenterText';
import ScrollViewFooter from '../../../components/ScrollViewFooter';
import ScrollViewHeader from '../../../components/ScrollViewHeader';
import MeasureUtils from '../../../utils/MeasureUtils';
import {getTransactionDateTimeString} from '../../../utils/TimerCommon';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';

const styles = StyleSheet.create({
  flatList: {
    marginTop: tiny,
  },
  itemContainer: {
    marginHorizontal: normal,
    flex: 1,
    marginBottom: 12,
    paddingHorizontal: normal,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  itemLine: {width: '100%', height: 1, backgroundColor: COLORS.SEPARATOR_LINE, marginTop: 12},
  itemTime: {
    paddingTop: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 12,
  },
  itemName: {marginLeft: normal, justifyContent: 'space-between'},
  iconHistory: {width: 52, height: 52},
  viewName: {flexDirection: 'row', marginTop: 12},
});

const DEFAULT_SECTION = 0;
const ITEM_HEIGHT = 126;
const PAGE_SIZE = 10;
const START_PAGE = 1;
const SORT_LEADER_FIRST = 'DESC';

const getHeightForMemberItem = async item => {
  const timeSize = await MeasureUtils.measureTextSize({
    text: item?.createdDatetime + '',
    ...FONTS.bold,
    fontSize: 13,
  });
  const avaSize = 54;
  return 12 + avaSize + timeSize.height + 12 + 12 + 12;
};

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

const HistoryItem = ({row, dataList, navigation}) => {
  const item = dataList[DEFAULT_SECTION].items[row];

  const onPressDetail = () => {
    navigation.navigate(ScreenIds.DetailHistoryUpdateInfoScreen, {
      id: item.customerInfoChangeHistoryId,
    });
  };

  return (
    <View style={HELPERS.fill}>
      <View style={styles.itemContainer}>
        <View style={styles.viewName}>
          <Image
            style={styles.iconHistory}
            resizeMode={'contain'}
            source={IMAGES.IC_HISTORY_UPDATE_INFO}
          />
          <View style={styles.itemName}>
            <Text style={{...FONTS.bold, fontSize: normal}}>{item.customerFullNameNew}</Text>
            <Text style={{...FONTS.bold, fontSize: normal}}>{item.customerFullNameOld}</Text>
          </View>
        </View>
        <View style={styles.itemLine} />
        <View style={styles.itemTime}>
          <Text style={{color: COLORS.GRAY_A3}}>
            {getTransactionDateTimeString(item?.createdDatetime)}
          </Text>
          <TouchableOpacity onPress={onPressDetail}>
            <Text style={{color: COLORS.PRIMARY_A100}}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ListHistoryUpdateInfoScreen = ({navigation, route}) => {
  const {id} = route?.params || {};
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

  const [execute, {loading, error, data, networkStatus, refetch, fetchMore}] =
    useGetCustomerInfoChangeHistoriesForFoLazyQuery({
      notifyOnNetworkStatusChange: true,
      onCompleted: onCompleted,
      ...FETCH_POLICY.CACHE_AND_NETWORK,
    });

  useMount(() => {
    execute({
      variables: {
        page: START_PAGE,
        pageSize: PAGE_SIZE,
        orderBy: {createdDatetime: SORT_LEADER_FIRST},
        depositTransactionId: id,
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

  const onLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchMore({
      variables: {page: newPage},
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return {
          getCustomerInfoChangeHistoriesForFO: {
            edges: [
              ...prev.getCustomerInfoChangeHistoriesForFO.edges,
              ...fetchMoreResult.getCustomerInfoChangeHistoriesForFO.edges,
            ],
          },
        };
      },
    });
  };

  useEffect(() => {
    if (data) {
      (async () => {
        setHandlingResponse(true);
        const rawItems = data?.getCustomerInfoChangeHistoriesForFO?.edges ?? [];
        const items = await getListItemWithHeight(rawItems);
        setDataList([{items}]);
        setHandlingResponse(false);
        setIsFirstLoad(false);
      })();
    }
  }, [data]);

  const allLoaded = dataList[DEFAULT_SECTION].items.length >= 20;

  return (
    <BaseScreen
      containerStyle={{backgroundColor: COLORS.BACKGROUND}}
      title={translate('transaction.detail.updateHistory')}>
      <CenterMessage
        loading={loading}
        handlingResponse={handlingResponse}
        isFirstLoad={isFirstLoad}
        data={dataList[DEFAULT_SECTION].items}
      />
      <LargeList
        ref={listRef}
        heightForSection={() => normal}
        heightForIndexPath={() => ITEM_HEIGHT}
        renderIndexPath={({row}) => (
          <HistoryItem row={row} dataList={dataList} navigation={navigation} />
        )}
        refreshHeader={ScrollViewHeader}
        loadingFooter={ScrollViewFooter}
        onRefresh={onRefresh}
        onLoading={onLoadMore}
        data={dataList}
        style={styles.flatList}
        allLoaded={allLoaded}
      />
    </BaseScreen>
  );
};

export default ListHistoryUpdateInfoScreen;
