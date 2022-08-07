import React, {createRef, useEffect, useState} from 'react';
import {Keyboard, StyleSheet, Text, View} from 'react-native';

import {useGetUserTransactionsLazyQuery} from '../../api/graphql/generated/graphql';
import {EMPTY_TYPE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import LazyList, {PAGING_TYPE} from '../../components/LazyList';
import ModalWithModalize from '../../components/Modal/ModalWithModalize';
import {NewPostStyles} from '../ManagePost/NewPost/NewPostComponents/NewPostConstant';
import ScreenIds from '../ScreenIds';
import SearchHeader from '../Search/components/SearchHeader';
import ManagePaymentFilter from './ManagePaymentFilter';
import ManagePaymentFilterUtil from './ManagePaymentFilterUtil';
import PaymentItem, {ItemHeight} from './PaymentItem';

const styles = StyleSheet.create({
  searchContainer: {
    marginLeft: normal,
  },
  countText: {
    ...FONTS.regular,
    ...METRICS.horizontalMargin,
    ...METRICS.smallMarginBottom,
    fontSize: 15,
    color: COLORS.TEXT_DARK_10,
  },
});

const ManagePaymentContainer = ({navigation, onShowFilter, filterData}) => {
  const responseDataKey = 'userTransactions';
  const responseDataArrayKey = 'edges';
  const [totalPayments, setTotalCount] = useState(0);
  const [searchKeyword, upDateSearchKey] = useState('');
  const [requestParams, setRequestParams] = useState(
    ManagePaymentFilterUtil.filterDataToQueryParams({
      paymentTransferNumber: searchKeyword,
      filterData,
    }),
  );

  const onKeywordChange = searchKey => {
    upDateSearchKey(searchKey);
  };

  const onPressPaymentItem = item => {
    const params = {
      userTransactionId: item?.userTransactionId,
      transactionServiceType: item?.transactionServiceType,
      transactionId: item?.transactionId,
      transactionType: item?.transactionType,
      propertyPostId: item?.propertyPostId,
    };
    navigation.navigate(ScreenIds.DetailPayment, params);
  };

  useEffect(() => {
    const newQuery = ManagePaymentFilterUtil.filterDataToQueryParams({
      paymentTransferNumber: searchKeyword,
      filterData,
    });
    setRequestParams(newQuery);
  }, [filterData, searchKeyword]);

  const renderTransaction = ({item}) => {
    return <PaymentItem paymentItem={item} onPress={() => onPressPaymentItem(item)} />;
  };

  return (
    <View style={HELPERS.fill}>
      <View style={NewPostStyles.viewWithIndex}>
        <SearchHeader
          renderLeft={false}
          placeholder={translate('payment.placeHolderPaymentCode')}
          style={styles.searchContainer}
          container={METRICS.resetPaddingVeritcal}
          onFilterPress={onShowFilter}
          onChangeKeyword={onKeywordChange}
        />
        <Text style={styles.countText}>
          {translate(STRINGS.PAYMENT_YOU_HAVE, {number: totalPayments})}
        </Text>
      </View>
      <LazyList
        renderItem={renderTransaction}
        useQuery={useGetUserTransactionsLazyQuery}
        queryOptions={{
          variables: {
            ...requestParams,
          },
        }}
        itemHeight={item => ItemHeight(item)}
        uniqueKey={'userTransactions'}
        extractArray={response => {
          return response?.[responseDataKey]?.[responseDataArrayKey] ?? [];
        }}
        extractTotalCount={response => response[responseDataKey]?.totalCount ?? 0}
        onDataChange={({totalCount}) => setTotalCount(totalCount)}
        pagingType={PAGING_TYPE.OFFSET_VARIABLES}
        emptyType={EMPTY_TYPE.PAYMENT}
      />
    </View>
  );
};

const ManagePaymentScreen = ({navigation}) => {
  const [filterData, setFilterData] = useState(ManagePaymentFilterUtil.getInitialFilterData());

  const modalRef = createRef();
  const onCloseFilter = () => {
    modalRef.current?.close();
  };
  const onShowFilter = () => {
    modalRef.current?.open();
    Keyboard?.dismiss();
  };
  const onApplyFilter = data => {
    setFilterData(data);
    onCloseFilter();
  };

  return (
    <BaseScreen
      title={translate(STRINGS.YOUR_PAYMENT_MANAGEMENT)}
      testID={ScreenIds.ManagePayment}
      modals={
        <ModalWithModalize getModalRef={modalRef}>
          <ManagePaymentFilter
            filterData={filterData}
            onClose={onCloseFilter}
            onConfirmed={onApplyFilter}
          />
        </ModalWithModalize>
      }>
      <View style={HELPERS.fill}>
        <ManagePaymentContainer
          filterData={filterData}
          onShowFilter={onShowFilter}
          navigation={navigation}
        />
      </View>
    </BaseScreen>
  );
};

export default ManagePaymentScreen;
