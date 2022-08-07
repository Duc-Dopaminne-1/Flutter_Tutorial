import moment from 'moment';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {
  useGetBookingHistoriesByBuyerIdCursorLazyQuery,
  useGetDepositHistoriesByBuyerIdCursorLazyQuery,
} from '../../api/graphql/generated/graphql';
import {getUserId} from '../../appData/user/selectors';
import {DEFAULT_PAGE_SIZE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal} from '../../assets/theme/metric';
import CustomTabView, {TAB_TYPE} from '../../components/CustomTabView';
import LazyList, {PAGING_TYPE} from '../../components/LazyList';
import ModalPopup from '../../components/Modal/ModalPopup';
import SafeAreaScreenContainer from '../../components/SafeAreaScreenContainer';
import {BookingContext} from '../BookingDeposit/useBooking';
import ScreenIds from '../ScreenIds';
import SearchHeader from '../Search/components/SearchHeader';
import {TransactionType} from './DetailTransaction/Components/DetailTransactionConstant';
import TransactionFilter from './TransactionFilter';
import TransactionItem, {ItemHeight} from './TransactionItem';
import TransactionUtil from './TransactionUtil';

const styles = StyleSheet.create({
  headerContainer: {
    ...HELPERS.row,
    ...METRICS.horizontalMargin,
    ...HELPERS.center,
    marginTop: 20,
    marginBottom: normal,
  },
  title: {
    ...FONTS.semiBold,
    fontSize: 24,
    flex: 1,
  },
  transactionCountText: {
    ...FONTS.regular,
    ...METRICS.horizontalMargin,
    fontSize: 15,
    color: COLORS.TEXT_DARK_10,
  },
  searchContainer: {
    marginLeft: normal,
    zIndex: 999,
  },
});

const cursorSetting = {
  first: DEFAULT_PAGE_SIZE,
  after: '',
};

const TransactionTab = ({navigation, isBooking}) => {
  const buyerId = useSelector(getUserId);
  const [totalTransaction, updateTotalTransaction] = useState(0);
  const [searchKeyword, upDateSearchKey] = useState('');
  const [isShowFilter, toggleFilter] = useState(false);
  const [filterData, setFilterData] = useState(TransactionUtil.getInitialFilterData());
  const [requestParams, setRequestParams] = useState(
    TransactionUtil.filterDataToQueryParams({
      buyerId,
      keywords: '',
      filterData,
      cursorSetting,
    }),
  );
  const {registerNewTransactionNotify, removeNewTransactionNotify} = useContext(BookingContext);
  const [updateRefresh, setUpdateRefresh] = useState();

  const onToggleFilter = () => toggleFilter(!isShowFilter);

  const onApplyFilter = data => {
    setFilterData(data);
    onToggleFilter();
  };

  const onKeywordChange = searchKey => {
    upDateSearchKey(searchKey);
  };

  const onPressTransactionItem = item => {
    const {transactionType} = item;
    let transactionId = item?.bookingTransactionId;
    let transactionCode = item?.bookingCode;
    const propertyPostId = item?.propertyPostId;
    if (transactionType === TransactionType.Deposit) {
      transactionId = item?.depositeTransactionId;
      transactionCode = item?.depositeCode;
    }
    const transferData = {
      transactionId,
      transactionType,
      transactionCode,
      propertyPostId,
    };
    navigation.navigate(ScreenIds.DetailTransaction, transferData);
  };

  useEffect(() => {
    const newQuery = TransactionUtil.filterDataToQueryParams({
      buyerId,
      keywords: searchKeyword,
      filterData,
      cursorSetting,
    });
    setRequestParams(newQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData, searchKeyword]);

  const onRefresh = () => {
    setUpdateRefresh(moment());
  };

  useEffect(() => {
    registerNewTransactionNotify({id: ScreenIds.Transaction, handler: onRefresh});
    return () => {
      removeNewTransactionNotify({id: ScreenIds.Transaction});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTransaction = ({item}) => {
    return <TransactionItem transaction={item} onPress={() => onPressTransactionItem(item)} />;
  };

  const isQueryKey = isBooking //format
    ? 'bookingHistoriesByBuyerIdCursor'
    : 'depositHistoriesByBuyerIdCursor';

  const extractArrayMapper = response => {
    const listTransaction = response?.[isQueryKey]?.edges;
    return listTransaction ?? [];
  };

  return (
    <View style={HELPERS.fill}>
      <SearchHeader
        renderLeft={false}
        placeholder={translate(STRINGS.SEARCH_TRANSACTION_PLACEHOLDER)}
        style={styles.searchContainer}
        onFilterPress={onToggleFilter}
        onChangeKeyword={onKeywordChange}
      />
      <Text style={styles.transactionCountText}>
        {translate(STRINGS.TRANSACTION_YOU_HAVE, {number: totalTransaction})}
      </Text>
      <LazyList
        renderItem={renderTransaction}
        useQuery={
          isBooking
            ? useGetBookingHistoriesByBuyerIdCursorLazyQuery
            : useGetDepositHistoriesByBuyerIdCursorLazyQuery
        }
        queryOptions={{variables: {...requestParams}}}
        itemHeight={item => ItemHeight(item.node)}
        extractArray={extractArrayMapper}
        mapToUiModel={item => item.node ?? {}}
        extractTotalCount={response => response[isQueryKey]?.totalCount ?? 0}
        onDataChange={({totalCount}) => updateTotalTransaction(totalCount)}
        pagingType={PAGING_TYPE.CURSOR2}
      />
      <ModalPopup
        contentContainerStyle={METRICS.resetPadding}
        visible={isShowFilter}
        onPressOutSide={onToggleFilter}
        animationType="slide">
        <TransactionFilter
          filterData={filterData}
          onClose={onToggleFilter}
          onConfirmed={onApplyFilter}
        />
      </ModalPopup>
    </View>
  );
};

const TransactionScreen = ({navigation}) => {
  const TRANSACTION_TYPE = {
    BOOKING: 'BOOKING',
    DEPOSIT: 'DEPOSIT',
  };

  const routes = [
    {key: TRANSACTION_TYPE.BOOKING, title: translate('transaction.tab.booking')},
    {key: TRANSACTION_TYPE.DEPOSIT, title: translate('transaction.tab.deposit')},
  ];

  const renderScene = ({route: {key}}) => {
    const isBooking = key === TRANSACTION_TYPE.BOOKING;
    return <TransactionTab navigation={navigation} isBooking={isBooking} />;
  };

  return (
    <SafeAreaScreenContainer testID={ScreenIds.Transaction}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{translate('transaction.header')}</Text>
      </View>
      <CustomTabView
        type={TAB_TYPE.BUTTONS}
        routes={routes}
        renderScene={renderScene}
        isLazy={true}
      />
    </SafeAreaScreenContainer>
  );
};

export default TransactionScreen;
