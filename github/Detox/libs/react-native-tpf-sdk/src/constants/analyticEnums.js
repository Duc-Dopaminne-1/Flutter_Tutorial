export const EVENT_TYPE = {
  BUTTON_TOUCH: 'user_button_touch',
  ITEM_TOUCH: 'user_item_touch',
  PAGE_DURATION: 'user_page_duration',
  REGISTER_SUCCESS: 'user_register_success',
  SUBSCRIPTION: 'user_subscription',
  SCROLL_VIEW: 'user_scroll_view',
  LOAN_CALC: 'user_loan_calc',
  CREATE_CREDIT: 'user_create_credit',
  CREATE_INSURANCE: 'user_create_insurance',
  CREATE_EXTRA_SERVICE: 'user_create_extra_service',
  CREATE_SUBSCRIPTION_TOPENER: 'user_create_subscription_topener',
  BECOME_TOPENER: 'user_become_topener',
  LOGIN: 'user_login',
  SHOW_ALL: 'user_show_all',
  REQUEST_SUPPORT: 'user_request_support',
  REVENUE: 'revenue_subscription'
};

const APP_ID = '1579469590';
const DEV_ANDROID_KEY = 'qRGTQa3bmjXfDqgnQSjonj'; // Get at app project on AppsFlyer -> Configuration -> App Settings
const DEV_IOS_KEY = 'qRGTQa3bmjXfDqgnQSjonj';

const APPS_FLYER_CONFIG = ({ isDebugMode = true }) => {
  return {
    devKey: DEV_ANDROID_KEY,
    isDebug: isDebugMode,
    onInstallConversionDataListener: true, //Optional
    onDeepLinkListener: true //Optional
  };
};

const APPS_FLYER_IOS_CONFIG = ({ isDebugMode = true }) => {
  return {
    devKey: DEV_IOS_KEY,
    isDebug: isDebugMode,
    appId: APP_ID, // for iOS only
    onInstallConversionDataListener: true, //Optional
    onDeepLinkListener: true, //Optional
    timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
  };
};

const CONVERSION_DATA_TYPE = {
  onAppOpenAttribution: 'onAppOpenAttribution',
  onInstallConversionDataLoaded: 'onInstallConversionDataLoaded',
  onAttributionFailure: 'onAttributionFailure',
  onInstallConversionFailure: 'onInstallConversionFailure',
  onInstallConversionSuccess: 'onInstallConversionSuccess'
};

const AF_STATUS = {
  Organic: 'Organic',
  NonOrganic: 'Non-organic'
};

export const APPS_FLYER = {
  DEV_ANDROID_KEY,
  DEV_IOS_KEY,
  APP_ID,
  APPS_FLYER_CONFIG,
  APPS_FLYER_IOS_CONFIG,
  CONVERSION_DATA_TYPE,
  AF_STATUS
};
