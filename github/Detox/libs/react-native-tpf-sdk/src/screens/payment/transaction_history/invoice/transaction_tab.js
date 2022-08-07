import { getAllTransactionHandle } from '../../../../redux/actions/invoice';
import { CommonTabHeader } from '../../../../components/';
import AppText from '../../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { formatDate } from '../../../../helpers/formatTime';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../../utils/responsive';
import DatePicker from '../components/date_picker';
import Item from '../components/transaction_item';
import { ICEmpty } from '../../../../assets/icons';
import { Divider } from '../../../../components/';

const StatusTab = [
  { id: 1, title: 'transaction_history.had' },
  { id: 2, title: 'transaction_history.expected' }
];

const TransactionTab = props => {
  const dispatch = useDispatch();
  const { transactionTab, navigation } = props || {};
  const memberId = useSelector(state => state.auth.memberId);
  const [startDate, setStartDate] = useState(moment().startOf('day').utc().format());
  const [endDate, setEndDate] = useState(moment().endOf('day').utc().format());
  const list = useSelector(state => state.invoice.transactionList);
  const loading = useSelector(state => state.invoice.transactionLoading);
  const totalCount = useSelector(state => state.invoice.transactionTotalCount);
  const [tabIndex, setTabIndex] = useState(transactionTab || 0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && refreshing) {
      setRefreshing(false);
    }
  }, [loading, refreshing]);

  useEffect(() => {
    onRefresh();
  }, [tabIndex, onRefresh, startDate, endDate]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(
      getAllTransactionHandle({
        transactionHistoryType: tabIndex === 0 ? 1 : 2,
        skipCount: 0,
        memberId: memberId,
        paymentTimeFrom: startDate,
        paymentTimeTo: endDate
      })
    );
  }, [dispatch, memberId, tabIndex, startDate, endDate]);

  const loadMore = useCallback(() => {
    if (!loading && list?.length < totalCount) {
      dispatch(
        getAllTransactionHandle({
          transactionHistoryType: tabIndex === 0 ? 1 : 2,
          memberId: memberId,
          paymentTimeFrom: startDate,
          paymentTimeTo: endDate,
          skipCount: list.length
        })
      );
    }
  }, [dispatch, memberId, loading, list, totalCount, tabIndex, startDate, endDate]);
  const renderItemRecords = ({ item }) => {
    let itemInfo = item?.transaction;
    return (
      <Item
        tabIndex={tabIndex}
        fee={itemInfo?.fee || 0}
        vat={itemInfo?.vat || 0}
        amount={itemInfo?.amount || 0}
        type={itemInfo?.type || 0}
        orderCode={itemInfo?.orderCode || ''}
        dayTrading={itemInfo?.paymentTime ? formatDate(itemInfo?.paymentTime) : ''}
        actualAmount={itemInfo?.actualAmount || 0}
        isAdvance={itemInfo?.isAdvance}
        expectedPaymentTime={
          itemInfo?.expectedPaymentTime ? formatDate(itemInfo?.expectedPaymentTime) : ''
        }
        navigation={navigation}
        transactionId={itemInfo?.id}
        keyExtractor={it => 'invoice' + item?.id + item?.transactionCode}
      />
    );
  };
  const ItemSeparatorComponent = () => <Divider />;
  return (
    <View style={styles.container}>
      <CommonTabHeader translate tabs={StatusTab} tabIndex={tabIndex} onPress={setTabIndex} />
      <View style={styles.listWrapper}>
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={value => {
            setStartDate(moment(value).startOf('day').utc().format());
          }}
          setEndDate={value => {
            setEndDate(moment(value).endOf('day').utc().format());
          }}
        />
        <AppText translate semiBold style={styles.title}>
          {'transaction_history.title_list'}
        </AppText>
        <FlatList
          style={styles.invoiceList}
          contentContainerStyle={styles.wrapper}
          showsVerticalScrollIndicator={false}
          renderItem={renderItemRecords}
          ItemSeparatorComponent={ItemSeparatorComponent}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReached={loadMore}
          data={list || []}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <ICEmpty />
              <AppText translate style={styles.emptyTitle}>
                {'common.list_empty'}
              </AppText>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default React.memo(TransactionTab);

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  emptyListContainer: {
    paddingTop: scale(24),
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTitle: {
    marginTop: scale(20),
    fontSize: FONT_SIZE.SubHead
  },
  wrapper: {},
  listWrapper: {
    flex: 1,
    paddingHorizontal: SPACING.Medium
  },
  list: {
    flex: 1
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: FONT_SIZE.BodyText
  },
  invoiceList: {
    marginTop: SPACING.Normal
  }
});
