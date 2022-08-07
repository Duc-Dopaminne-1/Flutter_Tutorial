import {useNavigation} from '@react-navigation/native';

import ScreenIds from '../../ScreenIds';

type payTransactionResponseDto = {
  linkPaymentUrl: String,
  returnUrl: String,
  disablePayment: Boolean,
};

export const usePayWithWebView = () => {
  const navigation = useNavigation();

  const payWithWebView = ({
    onPaymentSuccess,
    payTransactionResponse,
  }: {
    onPaymentSuccess: (transactionId: String, paymentReturnUrl: String) => {},
    payTransactionResponse: payTransactionResponseDto,
  }) => {
    navigation.navigate(ScreenIds.CommonPaymentWebView, {
      payTransactionResponse,
      onPaymentSucceedHandler: onPaymentSuccess,
    });
  };

  return {
    payWithWebView,
  };
};
