import { View } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Container from '@components/Container';
import translate from '@src/localize';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { CustomPopup } from '@src/components/CustomPopup';
import { CustomText } from '@src/components/CustomText';

interface Props {
  paymentUrl: string;
  reloadData?: () => void;
}

const Payment = (props: Props) => {
  const { paymentUrl, reloadData } = props;
  const [isShowPaymentLaterPopup, setShowPaymentLaterPopup] = useState<boolean>(false);
  const [isShowCompletedPopup, setShowCompletedPopup] = useState<boolean>(false);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const isCancel = useRef<boolean>(false);

  useEffect(() => {
    if (paymentCompleted) {
      setShowPaymentLaterPopup(false);
      setTimeout(() => {
        setShowCompletedPopup(true);
      }, 1000);
    }
  }, [paymentCompleted]);

  const renderRightHeader = () => {
    return !paymentCompleted ? <CustomText style={{ fontSize: 12, color: '#676877' }} text={translate('order.cancel')} /> : undefined;
  };

  const renderHeader = () => {
    return <CustomHeader title={translate('order.payment')} rightComponent={renderRightHeader()} rightAction={onCancel} />;
  };

  const onCancel = () => {
    isCancel.current = true;
    setShowPaymentLaterPopup(true);
  };

  const onPressActivePopup = () => {
    setShowPaymentLaterPopup(false);
    setShowCompletedPopup(false);
    if (reloadData) {
      NavigationActionsService.showLoading();
      setTimeout(() => {
        NavigationActionsService.hideLoading();
        NavigationActionsService.pop();
        !isCancel.current && reloadData();
      }, 3000);
    } else {
      NavigationActionsService.popToRoot();
    }
  };

  const onPressInactivePopup = () => {
    isCancel.current = false;
    setShowPaymentLaterPopup(false);
  };

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const responseUrl = event.nativeEvent.url;
      setPaymentCompleted(responseUrl.includes('paymentSuccess=true'));
    } catch (error) {
      console.log(error);
    }
  };

  const renderWebview = () => {
    return (
      <WebView source={{ uri: paymentUrl }} injectedJavaScript={'window.ReactNativeWebView.postMessage("data");'} onMessage={onMessage} />
    );
  };

  return (
    <Container>
      <CustomPopup
        text={translate('order.payment_later')}
        loading={isShowPaymentLaterPopup}
        buttonRedTitle={translate('common.yes')}
        buttonGrayTitle={translate('common.no')}
        onPressRedButton={onPressActivePopup}
        onPressGrayButton={onPressInactivePopup}
      />
      <CustomPopup text={translate('order.order_success')} loading={isShowCompletedPopup} onPressRedButton={onPressActivePopup} />
      <View style={{ flex: 1 }}>
        {renderHeader()}
        {renderWebview()}
      </View>
    </Container>
  );
};

export default Payment;
