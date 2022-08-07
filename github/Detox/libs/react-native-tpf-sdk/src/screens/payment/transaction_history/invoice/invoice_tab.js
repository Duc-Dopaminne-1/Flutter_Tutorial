import { clearInvoices, getAllInvoiceHandle } from '../../../../redux/actions/invoice';
import { ICEmpty } from '../../../../assets/icons';
import { CommonTabHeader, Divider } from '../../../../components/';
import AppText from '../../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { formatDate } from '../../../../helpers/formatTime';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from '../components/date_picker';
import Item from '../components/invoice_item';

const StatusTab = [
  {
    id: 1,
    title: 'transaction_history.finance',
    type: 1
  },
  {
    id: 2,
    title: 'transaction_history.insurance',
    type: 2
  },
  {
    id: 3,
    title: 'transaction_history.added_service',
    type: 3
  },
  {
    id: 4,
    title: 'transaction_history.membership_fee',
    type: 4
  }
];

const InvoiceTab = props => {
  const dispatch = useDispatch();
  const memberId = useSelector(state => state.auth.memberId);
  const [startDate, setStartDate] = useState(moment().startOf('day').utc().format());
  const [endDate, setEndDate] = useState(moment().endOf('day').utc().format());
  const list = useSelector(state => state.invoice.invoiceList);
  const loading = useSelector(state => state.invoice.invoiceLoading);
  const totalCount = useSelector(state => state.invoice.invoiceTotalCount);
  const featureList = useSelector(state => state.toggleFeature.featureList);
  const [tabIndex, setTabIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [statusTab, setStatusTab] = useState(StatusTab);
  const dateRef = useRef({
    startDate: moment().startOf('day').utc().format(),
    endDate: moment().endOf('day').utc().format()
  });
  useEffect(() => {
    setStartDate(dateRef.current.startDate);
    setEndDate(dateRef.current.endDate);
  }, []);

  useEffect(() => {
    let tmp = [];
    if (featureList?.includes('credit')) {
      tmp.push(StatusTab[0]);
    }
    if (featureList?.includes('insurance')) {
      tmp.push(StatusTab[1]);
    }
    tmp.push(StatusTab[2]); //extra-service
    tmp.push(StatusTab[3]);
    setStatusTab(tmp);
    setTabIndex(0);
  }, [featureList]);

  useEffect(() => {
    if (!loading && refreshing) {
      setRefreshing(false);
    }
  }, [loading, refreshing]);

  useEffect(() => {
    dispatch(clearInvoices());
    onRefresh();
  }, [tabIndex, onRefresh, startDate, endDate, dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(
      getAllInvoiceHandle({
        type: statusTab[tabIndex].type,
        skipCount: 0,
        memberId: memberId,
        paymentTimeFrom: startDate,
        paymentTimeTo: endDate,
        status: 2
      })
    );
  }, [dispatch, memberId, tabIndex, startDate, endDate, statusTab]);

  const loadMore = useCallback(() => {
    if (!loading && list?.length < totalCount) {
      dispatch(
        getAllInvoiceHandle({
          type: statusTab[tabIndex].type,
          skipCount: 0,
          memberId: memberId,
          paymentTimeFrom: startDate,
          paymentTimeTo: endDate,
          status: 2
        })
      );
    }
  }, [dispatch, memberId, loading, list, totalCount, tabIndex, endDate, startDate, statusTab]);

  const renderItemRecords = ({ item }) => {
    const itemInfo = item?.transaction;
    return (
      <Item
        tabIndex={tabIndex}
        type={itemInfo?.type || 1}
        amount={itemInfo?.amount || item.charges || 0}
        orderCode={itemInfo?.orderCode || item?.transactionCode}
        dayTrading={
          itemInfo?.lastModificationTime || item?.creationTime
            ? formatDate(itemInfo?.lastModificationTime || item?.creationTime)
            : ''
        }
        actuallyReceived={itemInfo?.actuallyReceived || 0}
        keyExtractor={it => 'invoice' + item?.id + item?.transactionCode}
      />
    );
  };

  const ItemSeparatorComponent = () => <Divider />;

  useEffect(() => {
    setData([...list]);
  }, [list]);

  return (
    <View style={styles.container}>
      <CommonTabHeader translate tabs={statusTab} tabIndex={tabIndex} onPress={setTabIndex} />
      <View style={styles.listWrapper}>
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={value => {
            setStartDate(moment(value).startOf('day').utc().format());
            dateRef.current.startDate = moment(value).startOf('day').utc().format();
          }}
          setEndDate={value => {
            setEndDate(moment(value).endOf('day').utc().format());
            dateRef.current.endDate = moment(value).startOf('day').utc().format();
          }}
        />
        <AppText semiBold translate style={styles.title}>
          {'transaction_history.title_list'}
        </AppText>
        {data.length !== 0 ? ( // lucnh5: There is a special error that should use this solution.
          <FlatList
            data={data || []}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReached={loadMore}
            style={styles.invoiceList}
            onEndReachedThreshold={0.4}
            // key="history-transaction-list"
            renderItem={renderItemRecords}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={ItemSeparatorComponent}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <ICEmpty />
                <AppText translate style={styles.emptyTitle}>
                  {'common.list_empty'}
                </AppText>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={[]}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReached={loadMore}
            style={styles.invoiceList}
            onEndReachedThreshold={0.4}
            renderItem={renderItemRecords}
            key="history-transaction-list-2"
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={ItemSeparatorComponent}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <ICEmpty />
                <AppText translate style={styles.emptyTitle}>
                  {'common.list_empty'}
                </AppText>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default React.memo(InvoiceTab);

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  emptyListContainer: {
    paddingTop: SPACING.Large,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTitle: {
    marginTop: SPACING.Large,
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
