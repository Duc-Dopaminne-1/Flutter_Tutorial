import { getTransactionsRequired } from '@/redux/payment/actions';
import { notificationService } from '../notification';
import { getReviewRequired } from '@/redux/reviews/actions';
import { MODAL_PAYMENT, PROFILE_SCREEN, REVIEW_SCREEN } from '@/navigation/screenKeys';
import NavigationActionsService from '../../navigation/navigation';
import { showGetVerify } from '@/shared/global';
import { Alert, Linking } from 'react-native';
import { language } from '@/i18n';
import { GeoOptions } from 'react-native-geolocation-service';
import { currencyFormat } from '@/shared/processing';

export const formatNameUser = (data: any) => {
  return `${data?.firstName || ''} ${data?.lastName || ''}`;
};

export const formatName = (name: string) => {
  if (name && name.length > 14) {
    return name.slice(0, 14).trim() + '...';
  }
  return name;
};

export const getShowReview = () => {
  NavigationActionsService.dispatchAction(
    getReviewRequired({
      callback: {
        onSuccess: reviews => {
          if (reviews && reviews.length > 0) {
            NavigationActionsService.push(REVIEW_SCREEN);
          }
        },
        onFail: _ => {},
      },
    }),
  );
};

export const getVerify = () => {
  NavigationActionsService.push(PROFILE_SCREEN);
  setTimeout(() => {
    showGetVerify.next(true);
  }, 700);
};

export const getReviews = () => {
  if (!notificationService.getStatusZoom()) {
    NavigationActionsService.dispatchAction(
      getReviewRequired({
        callback: {
          onSuccess: reviews => {
            if (reviews && reviews.length > 0) {
              NavigationActionsService.push(REVIEW_SCREEN);
            }
          },
          onFail: _ => {},
        },
      }),
    );
  }
};

const onCbPaymentIssueSuccess = () => {
  //Call API Get Review
  //If exist => show Review Screen
  setTimeout(() => {
    getReviews();
  }, 400);
};

const checkPaymentIssue = data => {
  if (data && data.length > 0) {
    const { amount, id } = data[0];
    NavigationActionsService.push(MODAL_PAYMENT, { amount, id, isFromPaymentDebt: true, onCbPaymentIssueSuccess });
    return;
  }
  //Call API Get Review
  //If exist => show Review Screen
  getReviews();
};

export const getReviewAndFee = (timeWait = 1000) => {
  setTimeout(() => {
    NavigationActionsService.dispatchAction(
      getTransactionsRequired({
        onSuccess: checkPaymentIssue,
      }),
    );
  }, timeWait);
};

export const onUnavailable = (blocked?: () => void) => {
  Alert.alert(language('turnOnLocation'), '', [
    { text: language('ok'), onPress: () => Linking.openURL('App-Prefs:Privacy') },
    { text: language('noThanks'), onPress: blocked },
  ]);
};

export const formatPriceAuction = (num: number): string => {
  return `${currencyFormat(num)} USD`;
};

export const getLocationSetting: GeoOptions = {
  accuracy: {
    android: 'high',
    ios: 'best',
  },
  enableHighAccuracy: true,
  timeout: 3000,
  maximumAge: 10000,
  distanceFilter: 0,
  showLocationDialog: false,
};
