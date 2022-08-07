import {useSelector} from 'react-redux';

import {getUserId} from '../../appData/user/selectors';
import {FETCH_POLICY} from '../../assets/constants';
import {
  useChangePushNotificationModeMutation,
  useGetUserPushNotificationLazyQuery,
} from '../graphql/generated/graphql';
import {useGraphqlApiLazy} from '../graphql/useGraphqlApiLazy';

const usePushNotification = props => {
  const {onSuccess, onError} = props ?? {};

  const onSuccessChangePushMode = () => {
    onSuccess && onSuccess();
  };

  const onErrorChangePushMode = error => {
    onError && onError(error);
  };

  const {startApi: changeNotificationMode} = useGraphqlApiLazy({
    graphqlApiLazy: useChangePushNotificationModeMutation,
    queryOptions: {},
    dataField: 'changePushNotificationMode',
    onSuccess: onSuccessChangePushMode,
    onError: onErrorChangePushMode,
    showSpinner: false,
  });

  const changePushNotificationMode = isEnable => {
    changeNotificationMode({variables: {input: {isEnable: !!isEnable}}});
  };

  return {changePushNotificationMode};
};

const useGetPushNotificationId = props => {
  const {onSuccess, onError} = props ?? {};
  const userId = useSelector(getUserId);

  const onSuccessGetData = data => {
    // logService.log('useGetPushNotificationId success', data);
    onSuccess && onSuccess(data);
  };

  const onErrorHandler = error => {
    // logService.log('useGetPushNotificationId error', error);
    onError && onError(error);
  };

  const {startApi: getNotificationId} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserPushNotificationLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
    onSuccess: onSuccessGetData,
    onError: onErrorHandler,
    showSpinner: false,
  });

  const getPushNotificationId = newUserId => {
    const inputUserId = newUserId ?? userId;
    getNotificationId({variables: {userId: inputUserId}});
  };

  return {getPushNotificationId};
};

export {useGetPushNotificationId, usePushNotification};
