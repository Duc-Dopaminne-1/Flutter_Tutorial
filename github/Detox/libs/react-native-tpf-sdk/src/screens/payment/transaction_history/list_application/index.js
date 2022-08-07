import AppText from '../../../../components/app_text';
import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import styles from './styles';
import { formatNumber } from '../../../../helpers/formatNumber';
import Divider from '../../../../components/divider';
import FastImage from 'react-native-fast-image';
import { ic_invoice_dollar } from '../../../../assets/images';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getAdvanceTransactionHandle } from '../../../../redux/actions/cashout';
import { LIMIT_PAGE } from '../../../../global/app';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Item = React.memo(({ label, value, isAmount }) => {
  return (
    <View style={styles.rowItem}>
      <AppText style={styles.normalTxt} translate>
        {label}
      </AppText>
      <AppText semiBold style={[styles.normalTxt, styles.boldTxt]} translate>
        {isAmount ? [formatNumber(value).toLocaleString('en'), 'common.currency'] : value}
      </AppText>
    </View>
  );
});

const ApplicationItem = React.memo(({ amount, orderCode }) => {
  return (
    <View style={styles.applicationItem}>
      <View style={styles.icon}>
        <FastImage style={styles.imageInvoice} source={ic_invoice_dollar} />
      </View>
      <View style={styles.applicationDetail}>
        <AppText translate semiBold style={[styles.amount, styles.amountApplication]}>
          {formatNumber(amount)}
          {'common.currency'}
        </AppText>
        <AppText translate style={styles.normalTxt}>
          {'transaction_history.application'}
          {orderCode}
        </AppText>
      </View>
    </View>
  );
});

const ListApplication = ({ route }) => {
  const { amount, fee, actualAmount, dayTrading, transactionId } = route.params || {};
  const dispatch = useDispatch();
  const isEndList = useSelector(state => state.cashout.isEndListAdvanceTransaction);
  const isLoading = useSelector(state => state.cashout.isLoadingAdvanceTransaction);
  const list = useSelector(state => state.cashout.advanceTransaction);
  const onFetch = useCallback(
    skipCount => {
      dispatch(
        getAdvanceTransactionHandle({
          params: {
            transactionId,
            skipCount,
            maxResultCount: LIMIT_PAGE
          }
        })
      );
    },
    [dispatch, transactionId]
  );

  useEffect(() => {
    onFetch(0);
  }, [onFetch]);
  const loadMore = useCallback(() => {
    if (!isEndList && !isLoading) {
      onFetch(list.length);
    }
  }, [isEndList, onFetch, list.length, isLoading]);

  const ListEmptyComponent = useCallback(
    () =>
      list.length !== 0 ? (
        isLoading ? (
          <ActivityIndicator />
        ) : null
      ) : isLoading ? (
        <ActivityIndicator />
      ) : (
        <AppText translate bold={true} style={styles.noData}>
          {'common.noData'}
        </AppText>
      ),
    [list, isLoading]
  );

  const renderItem = useCallback(({ item: _item }) => {
    return (
      <ApplicationItem
        amount={_item?.transaction?.amount}
        orderCode={_item?.transaction?.orderCode}
      />
    );
  }, []);
  const keyExtractor = useCallback(({ item: _item }, index) => (_item?.id || index).toString(), []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <AppText translate style={styles.amount}>
            {`+${formatNumber(actualAmount)}`}
            {'common.currency'}
          </AppText>
          <View style={styles.status}>
            <AppText translate semiBold style={styles.statusTxt}>
              {'transaction_history.money_in'}
            </AppText>
          </View>
        </View>
        <Divider style={styles.divider} />
        <Item label={'transaction_history.advance'} value={amount} isAmount />
        <Item label={'transaction_history.advance_fee'} value={fee} isAmount />
        <Item label={'transaction_history.day_trading'} value={dayTrading} />
      </View>
      <AppText translate style={[styles.boldTxt, styles.listApplicationText]}>
        {'transaction_history.list_application'}
      </AppText>

      <FlatList
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={list}
        onEndReached={loadMore}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

export default React.memo(ListApplication);
