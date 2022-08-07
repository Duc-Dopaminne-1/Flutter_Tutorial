import messaging from '@react-native-firebase/messaging';
import {useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import {getBundleId} from 'react-native-device-info';

import {useMount} from '../../screens/commonHooks';
import logService, {logStringee} from '../logService';

export const useStringeeClient = () => {
  const client = useRef();
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState('');

  // The client connects to Stringee server
  const onConnect = data => {
    logStringee('onConnect', data);
    setUserId(data.userId);
    setConnected(true);
  };

  // The client disconnects from Stringee server
  const onDisConnect = data => {
    logStringee('onDisConnect', data);
    setUserId('');
    setConnected(false);
    client?.current?.disconnect();
  };

  // The client fails to connects to Stringee server
  const onFailWithError = data => {
    logStringee('onFailWithError', data);
  };

  // Access token is expired. A new access token is required to connect to Stringee server
  const onRequestAccessToken = data => {
    logStringee('onRequestAccessToken', data);
    setConnected(false);
    // Token để kết nối tới Stringee server đã hết bạn.
    // Bạn cần lấy token mới và gọi connect lại ở đây
    // client.current.connect('NEW_TOKEN');
  };

  return {
    client,
    connected,
    userId,
    onConnect,
    onDisConnect,
    onFailWithError,
    onRequestAccessToken,
  };
};

export const useStringePush = (loggedIn, name, avatar) => {
  const client = useRef();
  const [connected, setConnected] = useState(false);
  const [deviceToken, setDeviceToken] = useState('');
  const [registered, setRegistered] = useState(false);
  const [apnsToken, setAPNSToken] = useState('');

  useMount(() => {
    if (Platform.OS === 'ios') {
      messaging()
        .getAPNSToken()
        .then(token => {
          setAPNSToken(token);
        })
        .catch(error => logService.log('get apns token error' + error));
    }
  });

  useEffect(() => {
    if (!connected || !deviceToken) {
      return;
    }

    if (loggedIn && !registered) {
      setRegistered(true);
      const isProduction = __DEV__ ? false : true;
      const packageNames = [getBundleId()];
      client.current?.registerPushAndDeleteOthers(
        deviceToken,
        isProduction,
        true,
        packageNames,
        (status, code, message) => {
          logStringee('registerPush' + code, {status, code, message});
        },
      );

      // chat 1-1
      if (Platform.OS === 'ios') {
        client.current?.registerPushAndDeleteOthers(
          apnsToken,
          isProduction,
          false,
          packageNames,
          (status, code, message) => {
            logStringee('registerPushForChat' + code, {status, code, message});
          },
        );
      }
    }

    if (!loggedIn && registered) {
      setRegistered(false);
      logStringee('unregisterPush');
    }
  }, [loggedIn, connected, deviceToken, registered, apnsToken]);

  useEffect(() => {
    if (connected) {
      const email = '';
      client.current?.updateUserInfo(name, email, avatar, (status, code, message, data) => {
        logStringee('updateUserInfo', {status, code, message, data});
      });
    }
  }, [connected, name, avatar]);

  const getClientId = () => {
    const clientId = client.current?.getId();
    if (!!clientId && connected) {
      return clientId;
    }
    return null;
  };

  const unRegisterPush = () => {
    client.current?.unregisterPush(deviceToken, (status, code, message) => {
      logStringee('unregisterPush' + code, {status, code, message});
    });

    if (Platform.OS === 'ios') {
      client.current?.unregisterPush(apnsToken, (status, code, message) => {
        logStringee('unregisterPushForChat' + code, {status, code, message});
      });
    }
  };

  return {
    client,
    connected,
    getClientId,
    setConnected,
    setDeviceToken,
    unRegisterPush,
  };
};
