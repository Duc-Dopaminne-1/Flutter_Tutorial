import { APPS_FLYER } from '../constants/analyticEnums';
import { Platform } from 'react-native';
// import appsFlyer from 'react-native-appsflyer';

export default class AppsFlyerService {
  instance = null;

  static getInstance() {
    if (this.instance == null) {
      this.instance = new AppsFlyerService();
    }
    return this.instance;
  }

  // init = isDebugMode => {
  //   const options =
  //     Platform.OS === 'ios'
  //       ? APPS_FLYER.APPS_FLYER_IOS_CONFIG({ isDebugMode })
  //       : APPS_FLYER.APPS_FLYER_CONFIG({ isDebugMode });
  //   appsFlyer.initSdk(
  //     options,
  //     result => {
  //       if (Platform.OS === 'android') {
  //         appsFlyer.setCollectAndroidID(true);
  //       }
  //     },
  //     error => {
  //     }
  //   );
  // };

  // setCustomUserId(userId) {
  //   appsFlyer.setCustomerUserId(userId.toString());
  // }

  logEvent = (key, params) => {
    // const eventName = key;
    // const eventValues = params;
    // appsFlyer.logEvent(
    //   eventName,
    //   eventValues,
    //   result => {
    //   },
    //   error => {
    //   }
    // );
  };

  logRevenue = (key, value) => {
    // const eventName = key;
    // const eventValues = {
    //   af_currency: 'VND',
    //   af_revenue: value
    // };
    // appsFlyer.logEvent(
    //   eventName,
    //   eventValues,
    //   result => {
    //   },
    //   error => {
    //   }
    // );
  };

  logInAppPurchase = info => {
    // if (Platform.OS === 'android') {
    //   info = {
    //     publicKey: 'key',
    //     currency: 'biz',
    //     signature: 'sig',
    //     purchaseData: 'data',
    //     ...info
    //   };
    // } else if (Platform.OS === 'ios') {
    //   info = {
    //     productIdentifier: 'identifier',
    //     currency: 'VND',
    //     transactionId: info.transactionId,
    //     ...info
    //   };
    // }
    // appsFlyer.validateAndLogInAppPurchase(
    //   info,
    // );
  };

  logLocationPressed = location => {
    // appsFlyer.logLocation(location.X, location.Y, result => {
    // });
  };

  stopPressed = () => {
    // appsFlyer.stop(
    //   true,
    //   res => {
    //   },
    //   err => {
    //   }
    // );
  };

  logCrossPromotion = (campaign, params) => {
    // appsFlyer.logCrossPromotionImpression(APPS_FLYER.APP_ID, campaign, params);
  };

  logCrossPromotionAndOpenStore = (campaign, params) => {
    // appsFlyer.logCrossPromotionAndOpenStore(APPS_FLYER.APP_ID, campaign, params);
  };

  anonymizeUser = () => {
    // appsFlyer.anonymizeUser(true, res => {
    // });
  };

  // generateInviteLink = async params => {
  //   return new Promise((resolve, reject) => {
  //     appsFlyer.generateInviteLink(
  //       params,
  //       link => {
  //         resolve(link);
  //       },
  //       err => {
  //         reject(err);
  //       }
  //     );
  //   });
  // };

  // onDeepLink = () =>
  //   appsFlyer.onDeepLink(res => {
  //   });

  // onAppOpenAttribution = () =>
  //   appsFlyer.onAppOpenAttribution(res => {
  //   });

  // onInstallConversionData = () =>
  //   appsFlyer.onInstallConversionData(res => {
  //     if (res.type === APPS_FLYER.CONVERSION_DATA_TYPE.onInstallConversionSuccess) {
  //       if (JSON.parse(res.data.is_first_launch) === true) {
  //         if (res.data.af_status === APPS_FLYER.AF_STATUS.NonOrganic) {
  //           const media_source = res.data.media_source;
  //           const campaign = res.data.campaign;
  //           // This is first launch and a Non-Organic install.
  //
  //         } else if (res.data.af_status === APPS_FLYER.AF_STATUS.Organic) {
  //           // This is first launch and a Organic Install
  //
  //         }
  //       } else {
  //         // This is not first launch
  //
  //       }
  //     }
  //   });
}
