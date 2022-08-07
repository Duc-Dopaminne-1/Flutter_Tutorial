import {useDispatch, useSelector} from 'react-redux';

import {updatePushNotificationId} from '../../appData/user/actions';
import {getPushNotificationId} from '../../appData/user/selectors';
import {addExternalUserId, removeExternalUserId} from '../../pushNotification/OneSignalPush';
import useGetAgentInfo from '../../screens/ManageBuyRequest/hooks/useGetAgentInfo';
import logService from '../../service/logService';
import {useGetPushNotificationId, usePushNotification} from './usePushNotification';

const useGetUserStartupData = ({onSuccess}) => {
  const oldPushNotificationId = useSelector(getPushNotificationId);
  const dispatch = useDispatch();

  const {getPushNotificationId: getNotificationId} = useGetPushNotificationId({
    onSuccess: onSuccessGetPushNotificationId,
    onError: onErrorGetPushNotification,
  });

  const [startGetUserInfoById] = useGetAgentInfo(); // get user role info for contactTradingProvider

  const {changePushNotificationMode} = usePushNotification({
    onSuccess: onSuccessChangePushNotification,
    onError: onErrorChangePushNotification,
  });

  function onSuccessGetPushNotificationId(data) {
    //get old push notification id
    const pushNotificationId = data?.userDto?.pushNotificationId;
    logService.log('pushNotificationId data', pushNotificationId);
    if (pushNotificationId) {
      logService.log('oldPushNotificationId data', oldPushNotificationId);
      if (oldPushNotificationId && oldPushNotificationId !== pushNotificationId) {
        logService.log('removeExternalUserId data', oldPushNotificationId);
        removeExternalUserId(oldPushNotificationId);
      }

      addExternalUserId(pushNotificationId);
      dispatch(updatePushNotificationId(pushNotificationId));
      changePushNotificationMode(true); //enable push notification for logged in user
    } else {
      onSuccess && onSuccess();
    }
  }

  function onErrorGetPushNotification(error) {
    //ignore change push notification mode
    logService.log('onErrorGetPushNotification error', error);
    onSuccess && onSuccess();
  }

  function onSuccessChangePushNotification() {
    onSuccess && onSuccess();
  }

  function onErrorChangePushNotification(error) {
    //ignore change push notification mode
    logService.log('onErrorChangePushNotification error', error);
    onSuccess && onSuccess();
  }

  const startGetUserData = userId => {
    getNotificationId(userId);
    startGetUserInfoById(userId);
  };

  return {startGetUserData};
};

export {useGetUserStartupData};
