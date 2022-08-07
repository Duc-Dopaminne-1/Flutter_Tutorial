import {useContext} from 'react';

import {
  useGetUnReadNotificationLazyQuery,
  useReadNotificationMutation,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../appData/appContext/useAppContext';
import {FETCH_POLICY} from '../../assets/constants';
import logService from '../../service/logService';

const useGetUnReadNotification = props => {
  const {setUnreadNoti} = useContext(AppContext);
  const {onSuccess, onError} = props ?? {};

  const onSuccessGetData = data => {
    const unReadNotificationCount = data?.totalCount ?? 0;
    logService.log('useGetUnReadNotification success', unReadNotificationCount);
    setUnreadNoti(unReadNotificationCount);
    onSuccess && onSuccess();
  };

  const onErrorHandler = error => {
    logService.log('useGetUnReadNotification error', error);
    onError && onError(error);
  };

  const {startApi: getUnReadNotification} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUnReadNotificationLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'notificationsByUserId',
    onSuccess: onSuccessGetData,
    onError: onErrorHandler,
    showSpinner: false,
  });

  // update read notification if needed
  const {startApi} = useGraphqlApiLazy({
    showSpinner: false,
    graphqlApiLazy: useReadNotificationMutation,
    queryOptions: {},
    dataField: null,
    onSuccess: () => {},
    onError: error => {
      logService.log('useReadNotificationMutation error===', error);
    },
  });

  function markUnReadNotification(notificationId) {
    startApi({
      variables: {
        input: {
          notificationId: notificationId,
          markRead: true,
          delete: false,
        },
      },
    });
  }

  return {getUnReadNotification, markUnReadNotification};
};

export default useGetUnReadNotification;
