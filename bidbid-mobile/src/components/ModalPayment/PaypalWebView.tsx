import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { colors } from '../../vars';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import NavigationActionsService from '../../navigation/navigation';
import { SafeArea } from '../SafeArea';
import { isIOS } from '../../shared/devices';

interface Prop {
  approveUrl: string;
  onCompletePaypal?: (isSuccess: boolean) => void;
}

const PaypalWebView = () => {
  const { approveUrl, onCompletePaypal } = useRoute().params as Prop;
  const [isPayment, setIsPayment] = useState(false);

  useEffect(() => {
    const backAction = () => {
      setIsPayment(true);
      NavigationActionsService.goBack();
      onCompletePaypal(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const stateChange = navState => {
    const { canGoBack, title, url } = navState;

    const conditionSuccess = isIOS
      ? canGoBack && !title && url.includes('payment-return')
      : canGoBack && title.includes('payment-return') && url.includes('payment-return');

    const conditionCancel = isIOS
      ? !title && url.includes('payment-cancel')
      : canGoBack && title.includes('payment-cancel') && url.includes('payment-cancel');

    if (conditionCancel) {
      setIsPayment(true);
      NavigationActionsService.goBack();
      onCompletePaypal(false);
      return;
    }

    if (conditionSuccess) {
      setIsPayment(true);
      NavigationActionsService.goBack();
      onCompletePaypal(true);
    }
  };

  const Spinner = () => (
    <View style={styles.activityContainer}>
      <ActivityIndicator size="large" color={colors.red_600} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeArea />
      {isPayment ? null : (
        <WebView
          startInLoadingState={true}
          style={styles.container}
          onNavigationStateChange={stateChange}
          renderLoading={Spinner}
          source={{ uri: approveUrl }}
        />
      )}
    </View>
  );
};

export default PaypalWebView;

const styles = StyleSheet.create({
  container: { flex: 1 },
  activityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: colors.white,
    height: '100%',
    width: '100%',
  },
});
