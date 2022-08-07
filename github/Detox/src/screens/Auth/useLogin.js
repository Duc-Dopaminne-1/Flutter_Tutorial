import {useContext, useState} from 'react';

import {AppContext} from '../../appData/appContext/appContext';
import {excuteCallbackLoginSuccess, rootNavigationRef, setCallbackLoginSuccess} from '../navigate';
import ScreenIds from '../ScreenIds';

export const useLogin = () => {
  const {getIsLoggedIn} = useContext(AppContext);
  const notLoggedIn = getIsLoggedIn ? !getIsLoggedIn() : false;

  const showLogin = callback => {
    setCallbackLoginSuccess(callback);
    if (!getIsLoggedIn()) {
      if (!rootNavigationRef?.current?.navigate) {
        setTimeout(() => {
          rootNavigationRef?.current?.navigate(ScreenIds.AuthStack);
        }, 400);
      } else {
        rootNavigationRef?.current?.navigate(ScreenIds.AuthStack);
      }
    } else {
      excuteCallbackLoginSuccess();
    }
  };

  return {showLogin, notLoggedIn};
};

export const useNotLoggedIn = () => {
  const {notLoggedIn} = useLogin();
  const [notLoggedInTmp] = useState(notLoggedIn);
  return notLoggedInTmp;
};
