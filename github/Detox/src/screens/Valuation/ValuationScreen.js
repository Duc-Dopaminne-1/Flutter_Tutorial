import React, {useContext, useRef, useState} from 'react';
import WebView from 'react-native-webview';

import {useApiCall} from '../../api/restful/useApiCall';
import {AppContext} from '../../appData/appContext/appContext';
import {translate} from '../../assets/localize';
import BaseScreen from '../../components/BaseScreen';
import Configs, {getConfigs} from '../../configs';
import {useLogin} from '../Auth/useLogin';
import {useMount} from '../commonHooks';
import ScreenIds from '../ScreenIds';
import {callApiGetToken} from './hooks/useGetToken';
import {
  INJECTEDJAVASCRIPT,
  USER_AGENT_VALUATION,
  ValuationSendRequestsToContainer,
  ValuationSentRequestsToFrame,
} from './ValuationContants';

const source = {
  uri: Configs.valuationUrl,
  headers: {
    Cookie: getConfigs().COOKIE,
  },
};

const ValuationScreen = ({navigation}) => {
  const {showLogin} = useLogin();
  const {getIsLoggedIn, showErrorAlert} = useContext(AppContext);
  const isLogin = getIsLoggedIn();
  const [token, setToken] = useState();
  const shareData = useRef();
  const formRef = useRef(null);

  const onError = () => {
    showErrorAlert(translate('supportRequest.message.systemError'), () => {
      navigation.goBack();
    });
  };

  const onSuccess = res => {
    if (res?.access_token) {
      setToken(res?.access_token);
    }
  };

  const {startApi} = useApiCall({
    onError,
    onSuccess,
  });

  const getTokenAction = () => {
    startApi(async () => {
      const response = await callApiGetToken();
      if (response?.data) {
        response.isSuccess = true;
      }
      return response;
    });
  };

  useMount(getTokenAction);

  const postMessageToFrame = params => {
    formRef?.current?.postMessage(JSON.stringify(params));
  };

  const sendDataToFrame = values => {
    postMessageToFrame({
      type: ValuationSentRequestsToFrame.SEND_INITIAL_DATA_TO_IFRAME,
      data: {
        token,
        isAuthenticated: isLogin,
        ...values,
      },
    });
  };

  const requireLogin = () => {
    showLogin(() => {
      sendDataToFrame(shareData.current);
    });
  };

  const onClose = () => {
    navigation.goBack();
  };

  const onCreatePost = () => {
    navigation.replace(ScreenIds.GeneralDescription);
  };

  const onMessage = event => {
    const obj = JSON.parse(event?.nativeEvent?.data);
    shareData.current = obj?.data;

    switch (obj?.type) {
      case ValuationSendRequestsToContainer.SENT_EVENT_TO_REQUEST_INITIAL_DATA:
        sendDataToFrame();
        break;
      case ValuationSendRequestsToContainer.SEND_DATA_CREATE_POST_TO_OUTSIDE:
        onCreatePost();
        break;
      case ValuationSendRequestsToContainer.SEND_EVENT_TO_CHECK_AUTHENTICATED:
        requireLogin();
        break;
      case ValuationSendRequestsToContainer.SEND_EVENT_TO_CLOSE_IFRAME:
        onClose();
        break;
      default:
        break;
    }
  };

  return (
    <BaseScreen title={translate('utilities360.valuatation')} showHeader>
      {token && (
        <WebView
          ref={formRef}
          source={source}
          javaScriptEnabled
          showsVerticalScrollIndicator={false}
          injectedJavaScript={INJECTEDJAVASCRIPT}
          applicationNameForUserAgent={USER_AGENT_VALUATION}
          useWebKit={true}
          incognito={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true}
          onMessage={onMessage}
        />
      )}
    </BaseScreen>
  );
};

export default ValuationScreen;
