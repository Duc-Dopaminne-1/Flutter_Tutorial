import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import URL from 'url';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {large} from '../../../assets/theme/metric';
import CenterText from '../../../components/CenterText';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import UrlUtils from '../../../utils/UrlUtils';

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  centerTextContainer: {
    paddingHorizontal: large,
  },
});

const ErrorView = ({message}) => {
  return <CenterText containerStyle={styles.centerTextContainer} title={message} />;
};

function renderError(errorDomain, errorCode) {
  let errorMessage = '';
  if (errorCode === -1009) {
    errorMessage = translate(Message.NTW_NETWORK_ERROR);
  } else {
    errorMessage = translate(Message.NTW_UNKNOWN_ERROR);
  }
  return <ErrorView message={errorMessage} />;
}

const PaymentWebview = ({paymentUrl, onNavigateToUrl, onShouldStartLoadUrl}) => {
  const webViewRef = useRef(null);
  const [showNetworkError, setShowNetworkError] = useState(false);
  const {state: appState} = useContext(AppContext);
  useEffect(() => {
    setShowNetworkError(!appState.isOnline);
  }, [appState.isOnline]);

  const navigationStateChangedHandler = ({url}) => {
    const validUrl = UrlUtils.getValidUrl(url);
    if (!validUrl) {
      return;
    }
    const urlObject = URL.parse(validUrl, true);
    onNavigateToUrl && onNavigateToUrl(validUrl, urlObject);
  };

  const onShouldStartLoadWithRequest = event => {
    const url = event?.url;
    const validUrl = UrlUtils.getValidUrl(url);
    if (!validUrl) {
      return false; // do not load page with invalid url
    }
    const urlObject = URL.parse(validUrl, true);
    if (onShouldStartLoadUrl) {
      return onShouldStartLoadUrl(validUrl, urlObject); // let delegate handle should request
    }

    return true; // load page with valid url
  };

  return (
    <KeyboardScrollView>
      {showNetworkError && <ErrorView message={translate(Message.NTW_NETWORK_ERROR)} />}
      <WebView
        style={styles.viewContainer}
        useWebKit={true}
        source={{uri: paymentUrl}}
        onNavigationStateChange={navigationStateChangedHandler}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        ref={webViewRef}
        renderError={renderError}
      />
    </KeyboardScrollView>
  );
};

export default PaymentWebview;
