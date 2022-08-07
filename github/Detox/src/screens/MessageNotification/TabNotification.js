import React, {forwardRef, useImperativeHandle} from 'react';

import {useGetNotificationsByUserIdLazyQuery} from '../../api/graphql/generated/graphql';
import LazyList, {PAGING_TYPE} from '../../components/LazyList';
import ModalSortNotify from '../Notification/ModalSortNotify';
import NotificationItem from '../Notification/NotificationItem';
import {useNotification} from './hooks/useNotification';

const TabNotification = ({}, ref) => {
  const {
    listReadNoti,
    onPressNotification,
    onReadNotificationSuccess,
    onDeleteNotificationSuccess,
    unReadNotification,
    actionListener,
    refreshData,
    queryParams,
    openModalSortNotify,
    readAllNotifications,
    modalSortRef,
    onApplySort,
    sortNotify,
    notificationType,
  } = useNotification();

  useImperativeHandle(ref, () => ({
    openModalSortNotify,
    readAllNotifications,
  }));

  const renderItem = ({item}) => {
    const checkedItem =
      item.isUnread && listReadNoti.includes(item.id) ? {...item, isUnread: false} : item;
    return (
      <NotificationItem
        notification={checkedItem}
        onPress={onPressNotification}
        onReadNotificationSuccess={() => onReadNotificationSuccess(item)}
        onDeleteNotificationSuccess={() => onDeleteNotificationSuccess(item)}
      />
    );
  };

  return (
    <>
      <LazyList
        updatedItem={unReadNotification}
        onDataChange={actionListener}
        renderItem={renderItem}
        refreshData={refreshData}
        queryOptions={{variables: queryParams}}
        extractArray={response => response?.notificationsByUserId?.edges ?? []}
        extractTotalCount={response => response?.notificationsByUserId?.totalCount}
        useQuery={useGetNotificationsByUserIdLazyQuery}
        pagingType={PAGING_TYPE.OFFSET_VARIABLES}
      />
      <ModalSortNotify
        ref={modalSortRef}
        onApplySort={onApplySort}
        currentFilter={{sortNotify, notificationType}}
      />
    </>
  );
};

export default forwardRef(TabNotification);
