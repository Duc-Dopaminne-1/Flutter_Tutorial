import React, {createRef, useContext} from 'react';
import TpfSdk from 'react-native-tpf-sdk';
import {useSelector} from 'react-redux';

import {
  GetUserByIdQueryVariables,
  GetUserResponse,
  useGetUserByIdLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {getAccessToken} from '../../../appData/authState/selectors';
import {store} from '../../../appData/store';
import {getUserId} from '../../../appData/user/selectors';
import {FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import Configs, {getConfigs} from '../../../configs';
import {logTPF} from '../../../service/logService';
import {useLogin} from '../../Auth/useLogin';
import {TPFUser} from '../types';
import useTheme from './useTheme';

export const REMOTE_ADDRESS = getConfigs().tpfSDK.remoteAddress;
export const SETTINGS = {
  scheme: `${Configs.deepLinking.DEEP_LINKING_APP_SCHEME}:/`,
  appId: getConfigs().tpfSDK.appId,
};

export const client = createRef();
let isLogin = false;

let successCalback = null;
let errorCalback = null;
const executeSuccessCalback = () => {
  if (successCalback) {
    successCalback();
    successCalback = null;
  }
};
const executeErrorCalback = () => {
  if (errorCalback) {
    errorCalback();
    errorCalback = null;
  }
};

export const useTPFClient = () => {
  const {showAppSpinner, showErrorAlert} = useContext(AppContext);
  const {notLoggedIn, showLogin} = useLogin();
  const userId = useSelector(getUserId);
  const {startApi: startGetUserById} = useMutationGraphql({
    graphqlApiLazy: useGetUserByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
    showSpinner: false,
  });

  const fetchUserLogin = () => {
    return new Promise((resolve, reject) => {
      const variables: GetUserByIdQueryVariables = {
        userId: userId,
      };

      startGetUserById(
        {variables},
        ({userDto}: GetUserResponse) => {
          const user: TPFUser = {
            phone: userDto?.phoneNumber,
            first_name: userDto?.firstName,
            last_name: userDto?.lastName,
          };
          resolve(user);
        },
        error => {
          reject(error);
        },
      );
    });
  };

  const login = async () => {
    if (notLoggedIn) {
      showLogin(() => {});
      return;
    }
    if (isLogin) {
      executeSuccessCalback();
      return;
    }
    try {
      showAppSpinner(true);
      errorCalback = () => {
        showAppSpinner(false);
        showErrorAlert(translate('tpf.error.init'));
      };
      const state = store.getState();
      const token = getAccessToken(state);
      const user = await fetchUserLogin();
      logTPF('connect', {token, user});
      client?.current?.connect({token, user});
    } catch (error) {
      logTPF('login', error);
      executeErrorCalback();
    }
  };

  const logout = () => {
    logTPF('disConnect');
    client?.current?.disConnect();
    isLogin = false;
  };

  const showCreateRequest = () => {
    successCalback = () => {
      showAppSpinner(false);
      client?.current?.showApplications({
        code: 'create_request',
      });
    };
    login();
  };

  const showProduct = data => {
    successCalback = () => {
      showAppSpinner(false);
      client?.current?.showProducts(data);
    };
    login();
  };

  const showBalance = () => {
    successCalback = () => {
      showAppSpinner(false);
      client?.current?.showBalance();
    };
    login();
  };

  const showHistories = () => {
    successCalback = () => {
      showAppSpinner(false);
      client?.current?.showHistorys();
    };
    login();
  };

  const showProfile = () => {
    successCalback = () => {
      showAppSpinner(false);
      client?.current?.showApplications({
        code: 'application_list',
        data: {
          tab: 0,
        },
      });
    };
    login();
  };

  const showRefund = () => {
    successCalback = () => {
      showAppSpinner(false);
      client?.current?.showRefund();
    };
    login();
  };

  return {
    client,
    login,
    logout,
    showCreateRequest,
    showProduct,
    showProfile,
    showBalance,
    showHistories,
    showRefund,
  };
};

export const TPFClient = () => {
  const {theme} = useTheme();

  const onConnect = data => {
    logTPF('onConnect', data);
    isLogin = true;
    executeSuccessCalback();
  };

  const onDisConnect = data => {
    logTPF('onDisConnect', data);
    isLogin = false;
  };

  const onFailWithError = data => {
    logTPF('onFailWithError', data);
    executeErrorCalback();
  };

  const onRequestAccessToken = async () => {
    logTPF('onRequestAccessToken');
    // console.log('onRequestAccessToken');
    // const result = await refresh(config, {
    //   refreshToken: refreshToken,
    // });
    // setRefreshToken(result.refreshToken);
    // return result.accessToken;
  };

  const onEventChange = object => {
    logTPF('onEventChange', object);
  };

  const onRequestLogin = () => {
    logTPF('onRequestLogin');
  };

  const clientEventHandlers = {
    onConnect,
    onDisConnect,
    onFailWithError,
    onRequestAccessToken,
    onEventChange,
    onRequestLogin,
  };

  return (
    <TpfSdk
      ref={client}
      eventHandlers={clientEventHandlers}
      theme={theme}
      remoteAddress={REMOTE_ADDRESS}
      setting={SETTINGS}
    />
  );
};
