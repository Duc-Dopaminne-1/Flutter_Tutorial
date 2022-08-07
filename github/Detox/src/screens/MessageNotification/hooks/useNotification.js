import {useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import {Keyboard} from 'react-native';

import {
  useGetSummaryNotificationByCurrentUserLazyQuery,
  useReadAllNotificationMutation,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {
  DEFAULT_PAGE_SIZE,
  FETCH_POLICY,
  NOTIFICATION_SUB_TYPE,
  SORT_ORDER,
  TYPE_SORT_NOTIFY,
} from '../../../assets/constants';
import {REFRESH_TYPE} from '../../../components/LazyList';
import {useCheckContactTradingB2CNotification} from '../../../hooks/useContactTradingB2C';
import useMergeState from '../../../hooks/useMergeState';
import UrlUtils from '../../../utils/UrlUtils';
import {initialFilter} from '../../Notification/ModalSortNotify';
import useGetUnReadNotification from '../../Notification/useGetUnReadNotification';
import {handleUrl} from '../../WithDeepLinking';

export const useNotification = () => {
  const modalSortRef = useRef();
  const [state, setState] = useMergeState({
    listReadNoti: [],
    refreshData: null,
    sortNotify: initialFilter.sortNotify,
    notificationType: initialFilter.notificationType,
  });

  const {sortNotify, listReadNoti, notificationType, refreshData} = state;

  const {
    state: {unReadNotification},
    setUnreadNoti,
    setSummaryNoti,
  } = useContext(AppContext);

  const checkContactTradingB2CNotification = useCheckContactTradingB2CNotification();

  const mapFilter = () => {
    const typeSort = sortNotify?.type,
      valueSort = sortNotify?.value;
    let variables = {
      order_by: {
        createdDatetime: SORT_ORDER.DESC,
      },
    };
    if (notificationType.id) {
      variables = {
        ...variables,
        where: {
          notificationType: notificationType.id,
        },
      };
    }
    if (typeSort === TYPE_SORT_NOTIFY.IS_UNREAD) {
      variables = {...variables, where: {...variables?.where, isUnread: valueSort}};
    }
    return variables;
  };

  const filter = useMemo(mapFilter, [sortNotify.id, notificationType.id]);

  const queryParams = {
    ...filter,
    pageSize: DEFAULT_PAGE_SIZE,
    page: 1,
  };

  const onSuccessData = data => {
    setSummaryNoti(data?.summaryNotificationDto);
  };

  const {startApi: getSumaryNotification} = useGraphqlApiLazy({
    showSpinner: false,
    graphqlApiLazy: useGetSummaryNotificationByCurrentUserLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getSummaryNotificationByCurrentUser',
    onSuccess: onSuccessData,
  });

  useEffect(() => {
    getSumaryNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unReadNotification]);

  const {getUnReadNotification} = useGetUnReadNotification();

  const actionListener = useCallback(() => {
    getUnReadNotification();
  }, [getUnReadNotification]);

  const updateUnreadNotification = () => {
    const count = unReadNotification - 1;
    setUnreadNoti(count);
  };

  const onReadNotificationSuccess = useCallback(
    item => {
      listReadNoti.push(item.id);
      updateUnreadNotification();
      setState({refreshData: {id: item.id, type: REFRESH_TYPE.MASK_AS_READ}});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unReadNotification, setUnreadNoti],
  );

  const onDeleteNotificationSuccess = useCallback(
    item => {
      if (item.isUnread) {
        updateUnreadNotification();
      }
      setState({refreshData: {id: item.id, type: REFRESH_TYPE.DELETE}});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unReadNotification],
  );

  const onPressNotification = useCallback(
    //format
    (notification: NotificationDto) => {
      const isContactTradingB2CType =
        notification.subTypeCode === NOTIFICATION_SUB_TYPE.CONTACT_TRADING_B2C;

      if (isContactTradingB2CType) {
        const notificationId = notification.id;
        const onDone = () => {
          onDeleteNotificationSuccess(notification);
        };

        checkContactTradingB2CNotification(notificationId, notification.message, onDone);
        return;
      }

      // navigate to detail page if notification has link
      const url = notification?.link;
      const evaluatedUrl = UrlUtils.getAbsoluteUrl(url);
      handleUrl(evaluatedUrl);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onSuccess = () => setUnreadNoti(0);

  const {startApi: readAllNotifications} = useGraphqlApiLazy({
    showSpinner: true,
    graphqlApiLazy: useReadAllNotificationMutation,
    queryOptions: {},
    dataField: null,
    onSuccess,
  });

  const openModalSortNotify = () => {
    Keyboard.dismiss();
    modalSortRef.current?.openModal();
  };

  const onApplySort = data => {
    setState({
      sortNotify: data.sortNotify,
      notificationType: data.notificationType,
    });
  };

  return {
    listReadNoti,
    onPressNotification,
    onReadNotificationSuccess,
    onDeleteNotificationSuccess,
    unReadNotification,
    actionListener,
    refreshData,
    queryParams,
    readAllNotifications,
    modalSortRef,
    openModalSortNotify,
    onApplySort,
    sortNotify,
    notificationType,
  };
};
