import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet} from 'react-native';

import {
  useGetC2CContactTradingsByC2CDemandIdLazyQuery,
  useGetContactTradingsForC2CDemandLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {CONTACT_STATUS_STYLE, EMPTY_TYPE, SORT_ORDER} from '../../../assets/constants';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import {formatTimeToTimeDate} from '../../../utils/TimerCommon';
import ListRecentItem from './ListRecentItem';

export const ITEM_HEIGHT = () => {
  return 140;
};

const mapToItem = item => {
  return {
    ...item,
    createdDatetime: formatTimeToTimeDate(item?.createdDatetime),
  };
};

const mapContactTradingToItem = (item, c2cDemandContactTradings) => {
  const objMapC2CDemandContactTrading = c2cDemandContactTradings?.reduce(
    (obj, currentObj) => ({...obj, [currentObj?.contactTradingId]: currentObj}),
    {},
  );
  const contactTradingStatusId =
    objMapC2CDemandContactTrading?.[item?.contactTradingId]?.contactTradingStatusId;

  const contactTradingStatus = CONTACT_STATUS_STYLE[contactTradingStatusId];

  return {
    ...item,
    contactTradingStatusColor: contactTradingStatus?.color,
    contactTradingStatusBgColor: contactTradingStatus?.backgroundColor,
    contactTradingStatusName: contactTradingStatus?.name,
  };
};

const RequestRecentView = ({c2CDemandId = ''}) => {
  const variables = {
    c2CDemandId,
    order_by: {
      createdDatetime: SORT_ORDER.DESC,
    },
  };

  const {startApi: getContactTradingsForC2CDemand, data: contactTradingListResponse} =
    useGraphqlApiLazy({
      graphqlApiLazy: useGetContactTradingsForC2CDemandLazyQuery,
      dataField: 'getContactTradingsForC2CDemand',
      queryOptions: {},
    });

  const contactTradingList = get(contactTradingListResponse, 'edges', []);

  const renderItem = ({item, index}) => {
    return (
      <ListRecentItem
        item={mapContactTradingToItem(item, contactTradingList)}
        onPress={() => {}}
        isFirstItem={index === 0}
      />
    );
  };

  const onQueryCompleted = items => {
    getContactTradingsForC2CDemand({
      variables: {
        where: {
          contactTradingId_in: Array.isArray(items) && items?.map(d => d?.contactTradingId),
        },
      },
    });
  };

  return (
    <LazyList
      useQuery={useGetC2CContactTradingsByC2CDemandIdLazyQuery}
      queryOptions={{variables}}
      extractArray={response => response?.getC2CContactTradingsByC2CDemandId?.edges ?? []}
      mapToUiModel={item => mapToItem(item)}
      renderItem={renderItem}
      itemHeight={ITEM_HEIGHT}
      pagingType={PAGING_TYPE.OFFSET_VARIABLES}
      emptyType={EMPTY_TYPE.BUY_REQUEST}
      containerStyle={styles.containerStyle}
      contentStyle={styles.contentStyle}
      onQueryCompleted={onQueryCompleted}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 0,
  },
  contentStyle: {
    paddingHorizontal: 0,
  },
});

RequestRecentView.propTypes = {
  c2CDemandId: PropTypes.string,
};

export default RequestRecentView;
