import {useNavigation} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';

import {AppContext} from '../../../appData/appContext/appContext';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {normal} from '../../../assets/theme/metric';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import JsonDataUtils from '../../../utils/JsonDataUtils';
import {getDateBefore} from '../../../utils/TimerCommon';
import ScreenIds from '../../ScreenIds';
import SearchHeader from '../../Search/components/SearchHeader';
import ModalFilterListSupport from './ModalFilter';
import RequestSupportItem from './RequestSupportItem';

const style = StyleSheet.create({
  searchHeader: {marginLeft: normal, zIndex: 999},
  customSearch: {borderWidth: SIZES.BORDER_WIDTH_1, borderColor: COLORS.GRAY_C9},
});

const initState = {
  ticketStatusId: null,
  supportServiceId: null,
  ticketCode: null,
  appointmentDatetime_gte: getDateBefore(365).toISOString(),
  appointmentDatetime_lte: new Date().toISOString(),
};

export const getInitialFilterState = () => {
  return {
    ticketStatusId: null,
    supportServiceId: null,
    ticketCode: null,
    appointmentDatetime_gte: getDateBefore(365).toISOString(),
    appointmentDatetime_lte: new Date().toISOString(),
  };
};

const mapFilterToQuery = filter => {
  const {
    ticketStatusId,
    supportServiceId,
    ticketCode,
    appointmentDatetime_gte,
    appointmentDatetime_lte,
  } = filter;
  return JsonDataUtils.deleteEmptyDataFiled({
    ticketStatusId_in: ticketStatusId,
    supportServiceId,
    ticketCode: isEmpty(ticketCode) ? null : ticketCode,
    appointmentDatetime_gte: moment(appointmentDatetime_gte).startOf('day').valueOf(),
    appointmentDatetime_lte: moment(appointmentDatetime_lte).endOf('day').valueOf(),
  });
};

const mapItemToUi = (item, isRequest) => {
  return {
    createTime: moment(item?.createdDatetime).format('DD/MM/YYYY HH:mm'),
    servicesName: item?.supportServiceName,
    propertyCode: item?.propertyPostCode,
    ticketCode: item?.ticketCode,
    name: isRequest ? item?.currentExecutorName : item?.requesterFullName,
    ticketStatusId: item?.ticketStatusId,
    title: isRequest
      ? `${translate('supportRequest.item.executor')}`
      : `${translate('supportRequest.item.requester')}`,
    propertyPostId: item?.propertyPostId,
  };
};

const RequestSupportList = ({dataKey, isRequest, query}) => {
  const modalFilterRef = React.useRef(null);
  const [filterState, setFilterState] = useState(getInitialFilterState());
  const navigation = useNavigation();
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const queryParams = {
    page: 1,
    pageSize: 10,
    orderBy: {
      appointmentDatetime: 'DESC',
    },
    where: mapFilterToQuery(filterState),
  };

  const renderItem = ({item}) => {
    const data = mapItemToUi(item, isRequest);
    return (
      <RequestSupportItem
        item={data}
        isRequest={isRequest}
        masterData={masterData}
        onPress={() => onPressDetailRequest(item)}
      />
    );
  };

  const onPressDetailRequest = item => {
    navigation.navigate(ScreenIds.DetailRequestSupport, {
      ticketId: item?.supportServiceTicketId,
      propertyPostId: item?.propertyPostId,
      isRequest: isRequest,
    });
  };

  const onChangeFilter = (key, value) => {
    setFilterState({...filterState, [key]: value});
  };

  const applyFilter = data => {
    setFilterState({...filterState, ...data});
  };

  return (
    <>
      <SearchHeader
        customStyle={style.customSearch}
        renderLeft={false}
        placeholder={translate('supportRequest.searchPlaceholder')}
        style={style.searchHeader}
        onFilterPress={() => modalFilterRef?.current?.open()}
        onChangeKeyword={e => onChangeFilter('ticketCode', e)}
      />
      <LazyList
        renderItem={renderItem}
        extractArray={response => response?.[dataKey]?.edges || []}
        useQuery={query}
        queryOptions={{variables: {...queryParams}}}
        pagingType={PAGING_TYPE.OFFSET_VARIABLES}
      />
      <ModalFilterListSupport
        initState={initState}
        isRequest={isRequest}
        filterData={filterState}
        applyFilterList={applyFilter}
        ref={modalFilterRef}
      />
    </>
  );
};

export default RequestSupportList;
