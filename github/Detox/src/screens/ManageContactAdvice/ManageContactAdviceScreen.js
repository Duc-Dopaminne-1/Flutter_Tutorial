import moment from 'moment';
import React, {useRef, useState} from 'react';
import {Keyboard, StyleSheet} from 'react-native';

import {
  GetSupportRequestsQueryVariables,
  SupportRequestInfoDto,
  useGetSupportRequestsLazyQuery,
} from '../../api/graphql/generated/graphql';
import {CONSTANTS, DEFAULT_PAGE_SIZE, EMPTY_TYPE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {normal} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import LazyList, {PAGING_TYPE} from '../../components/LazyList';
import ModalWithModalize from '../../components/Modal/ModalWithModalize';
import {dateToTimestamp, getTransactionDateTimeString} from '../../utils/TimerCommon';
import ScreenIds from '../ScreenIds';
import SearchHeader from '../Search/components/SearchHeader';
import Filter, {getInitialFilterState} from './components/Filter';
import ListItem from './components/ListItem';
import {getDataByStatusName} from './utils/getDataByStatusName';

const ITEM_HEIGHT = async () => {
  return 189;
};

const ManageContactAdviceScreen = ({navigation}) => {
  const filterModalRef = useRef();
  const [filterState, setFilterState] = useState(getInitialFilterState());
  const [keyword, setKeyword] = useState('');
  const variables: GetSupportRequestsQueryVariables = {
    first: DEFAULT_PAGE_SIZE,
    orderBy: {
      createdDatetime: 'DESC',
    },
    where: {
      supportRequestCode_contains: keyword.trim(),
      createdDatetime_gte: dateToTimestamp(
        new Date(moment(filterState.fromDate).startOf(CONSTANTS.DAY)),
      ),
      createdDatetime_lte: dateToTimestamp(
        new Date(moment(filterState.toDate).endOf(CONSTANTS.DAY)),
      ),
      AND: [
        {OR: filterState.statusIds.map(id => ({supportRequestStatusId: id}))},
        {OR: filterState.typeIds.map(id => ({requestTypeId: id}))},
      ],
    },
  };

  const onPressDetail = id => () => {
    navigation.navigate(ScreenIds.DetailContactAdvice, {
      id: id,
    });
  };

  const onPressProduct = (id, type) => () => {
    if (type === 1) {
      navigation.navigate(ScreenIds.ProjectDetail, {
        projectId: id,
      });
    } else if (type === 2) {
      navigation.navigate(ScreenIds.ViewPropertyPost, {
        propertyPostId: id,
        viewByOtherMode: true,
      });
    }
  };

  const onPressOpenFilter = () => {
    Keyboard.dismiss();
    filterModalRef?.current?.open();
  };

  const onPressApplyFilter = () => {
    filterModalRef?.current?.close();
  };

  const renderModals = () => {
    return (
      <ModalWithModalize getModalRef={filterModalRef}>
        <Filter state={filterState} setState={setFilterState} onPressApply={onPressApplyFilter} />
      </ModalWithModalize>
    );
  };

  const renderItem = ({item}: {item: SupportRequestInfoDto}) => {
    return (
      <ListItem
        data={{
          code: item.supportRequestCode,
          type: item.requestTypeDescription,
          product: item.productName,
          status: getDataByStatusName(item.supportRequestStatusName).description,
          date: getTransactionDateTimeString(item?.createdDatetime),
        }}
        statusColor={getDataByStatusName(item.supportRequestStatusName).backgroundColor}
        onPress={onPressDetail(item?.supportRequestId)}
        onPressProduct={onPressProduct(item.productId, item.productType)}
      />
    );
  };

  return (
    <BaseScreen
      testID={ScreenIds.ManageContactAdvice}
      title={translate('contactAdvice.menu')}
      modals={renderModals()}>
      <SearchHeader
        container={styles.search}
        renderLeft={false}
        placeholder={translate('contactAdvice.searchPlaceholder')}
        onChangeKeyword={setKeyword}
        onFilterPress={onPressOpenFilter}
      />
      <LazyList
        useQuery={useGetSupportRequestsLazyQuery}
        queryOptions={{variables}}
        extractArray={response => response?.supportRequestsExactByCurrentUserMobile?.edges ?? []}
        mapToUiModel={item => item?.node}
        renderItem={renderItem}
        itemHeight={ITEM_HEIGHT}
        pagingType={PAGING_TYPE.CURSOR2}
        emptyType={EMPTY_TYPE.BUY_REQUEST}
      />
    </BaseScreen>
  );
};

export default ManageContactAdviceScreen;

const styles = StyleSheet.create({
  search: {
    paddingVertical: 0,
    marginLeft: normal,
  },
});
