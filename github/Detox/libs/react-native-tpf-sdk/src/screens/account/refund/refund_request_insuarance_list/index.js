import { clearInvoices, getAllInvoiceHandle } from '../../../../redux/actions/invoice';
import { CommonTabHeader } from '../../../../components';
import AppText from '../../../../components/app_text';
import SCREENS_NAME from '../../../../constants/screens';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import RefundRequestItem from '../refund_request_item';
import styles from './styles';
import { getSummaryInsuranceHandler } from '../../../../redux/actions/deposit';

const RefundRequestInsuaranceList = ({ navigation }) => {
  const dispatch = useDispatch();

  const memberId = useSelector(state => state.auth.memberId);
  const list = useSelector(state => state.invoice.invoiceList);
  const loading = useSelector(state => state.invoice.invoiceLoading);
  const totalCount = useSelector(state => state.invoice.invoiceTotalCount);
  const pendingCount = useSelector(state => state.deposit.pendingInsuranceCount);
  const paidCount = useSelector(state => state.deposit.paidInsuranceCount);
  const [tabIndex, setTabIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const StatusTab = [
    {
      id: 1,
      title: 'refund_request.processing',
      count: pendingCount?.toString()
    },
    {
      id: 2,
      title: 'refund_request.completed',
      count: paidCount?.toString()
    }
  ];

  useEffect(() => {
    navigation.setOptions({
      backAction: () => {
        navigation.goBack();
      }
    });
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <RefundRequestItem item={item?.transaction} tabIndex={tabIndex} refundRequestInsuarance />
      );
    },
    [tabIndex]
  );

  useEffect(() => {
    if (!loading && refreshing) {
      setRefreshing(false);
    }
  }, [loading, refreshing]);

  useEffect(() => {
    dispatch(clearInvoices());
    onRefresh();
  }, [tabIndex, onRefresh, dispatch]);

  useEffect(() => {
    dispatch(
      getSummaryInsuranceHandler({
        params: {
          memberId
        }
      })
    );
  }, [dispatch, memberId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(
      getSummaryInsuranceHandler({
        params: {
          memberId
        }
      })
    );
    dispatch(
      getAllInvoiceHandle({
        type: 5,
        skipCount: 0,
        memberId: memberId,
        status: tabIndex === 0 ? 1 : 2
      })
    );
  }, [dispatch, tabIndex, memberId]);

  const loadMore = useCallback(() => {
    if (!loading && list?.length < totalCount) {
      dispatch(
        getAllInvoiceHandle({
          type: 5,
          skipCount: list?.length,
          memberId: memberId,
          status: tabIndex === 0 ? 1 : 2
        })
      );
    }
  }, [loading, list?.length, totalCount, dispatch, memberId]);

  const ListEmptyComponent = useCallback(
    () =>
      list?.length !== 0 ? (
        loading ? (
          <ActivityIndicator />
        ) : null
      ) : loading ? (
        <ActivityIndicator />
      ) : (
        <AppText translate bold={true} style={styles.noData}>
          {'common.noData'}
        </AppText>
      ),
    [list, loading]
  );

  const keyExtractor = useCallback((item, index) => (item?.id || index).toString(), []);

  return (
    <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
      <View style={styles.wrapper}>
        <CommonTabHeader
          justify
          translate
          tabs={StatusTab}
          tabIndex={tabIndex}
          onPress={setTabIndex}
        />
        {list?.length > 0 ? (
          <AppText translate semiBold style={styles.numberOfTransaction}>
            {list?.length}
            {'order_history.transaction'}
          </AppText>
        ) : null}
        <FlatList
          key={tabIndex}
          data={list || []}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
          onEndReached={loadMore}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </SafeAreaView>
  );
};

export default React.memo(RefundRequestInsuaranceList);
