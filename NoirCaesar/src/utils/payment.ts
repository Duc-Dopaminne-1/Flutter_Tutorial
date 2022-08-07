import Axios from 'axios';
import { ProviderEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop';
import NavigationActionsService from '@src/navigation/navigation';
import { PAYMENT } from '@src/constants/screenKeys';
import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { IError } from '@src/modules/base';
import translate from '@src/localize';

export const paymentOrder = async (url: string, provider: string, onSuccess: () => void, onFail: (error: IError) => void, reloadData?: () => void) => {
  NavigationActionsService.showLoading();
  try {
    const token = await api.Auth.getAuthToken().then(res => res?.access_token);
    if (token) {
      const responseOption = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await Axios.get(url, responseOption);

      switch (provider) {
        case ProviderEnum.Stripe:
          await Axios.get(response.data.payment_uri, responseOption);
          onSuccess();
          break;
        case ProviderEnum.PayPal:
          NavigationActionsService.push(PAYMENT, { paymentUrl: response.data.payment_uri, reloadData }, true);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    if (error && error.response && error.response.data) {
      onFail({ ...error.response.data });
    }
    else {
      onFail({ code: 400, message: translate("alert.message_error_default") });
    }
  }
  NavigationActionsService.hideLoading();
};
