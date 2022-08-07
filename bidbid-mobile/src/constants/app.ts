import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';

export const PHONE_CODE = Config.ENV === 'development' ? '+84' : '+1'; // '+1';
export const CCA2 = Config.ENV === 'development' ? 'VN' : 'US'; // 'US';
export const LOAD_PROFILE_DISCOVERY = 25;
export const TIME_LOAD_SPLASH_SCREEN = 2200;
export const TIME_VERIFY_SMS = 30;
export const VERSION_DEVICE_LOGIN_APPLE = 13;
const index = DeviceInfo.getSystemVersion().indexOf('.');
export const VERSION_DEVICE = parseInt(DeviceInfo.getSystemVersion().slice(0, index));
export const APP_VERSION = DeviceInfo.getVersion();
export const SEARCH_NEAR_PLACE_MAP = 'cafe';
export const TYPE_DISTANCE = 'Km';
export const AUTH_SESSION_KEY = 'AUTH_SESSION_KEY';
export const AUTH_SMS_SESSION_KEY = 'AUTH_SMS_SESSION_KEY';
export const REFRESH_SESSION_KEY = 'refresh_token';
export const FCM_TOKEN = 'FCM_TOKEN';
export const IS_FIRST_INSTALL = 'IS_FIRST_INSTALL';
export const IS_FIRST_REVIEW = 'IS_FIRST_REVIEW';
export const IS_FIRST_MEET_GREAT_PERSON = 'IS_FIRST_MEET_GREAT_PERSON';
export const IS_FIRST_MEET_GREAT_VIRTUAL = 'IS_FIRST_MEET_GREAT_VIRTUAL';
export const FORCE_UPDATE = 'FORCE_UPDATE';
export const IS_CANCEL_UPDATE = 'IS_CANCEL_UPDATE';
export const LOCALE = 'LOCALE';
export const FILTER_GLOBAL = 'FILTER_GLOBAL';
export const CURRENT_LOCATION = 'CURRENT_LOCATION';

export const RulePayment: TypeRulePayment = {
  PayPal: 'paypal',
  Card: 'credit_card',
  Venmo: 'venmo',
};

export const RulePause = {
  Payment: 'payment',
  Period: 'period',
};

export type TypeRulePayment = {
  PayPal?: string;
  Card?: string;
  Venmo?: string;
};

export const CardType = {
  Visa: 'Visa',
  MasterCard: 'MasterCard',
};

export const TypeMG = {
  Offline: 'Offline',
  Online: 'Online',
};

export const RuleSocial: TypeRuleSocial = {
  Facebook: 'facebook',
  Google: 'google-plus',
  Apple: 'apple',
  PhoneNumber: 'phone-number',
};

export type TypeRuleSocial = {
  Facebook?: string;
  Google?: string;
  Apple?: string;
  PhoneNumber?: string;
};

export const StatusProfile: TypeProfile = {
  COMPLETING: 'COMPLETING',
  COMPLETED: 'COMPLETED',
  VERIFIED: 'VERIFIED',
  INVALID: 'INVALID',
  PENDING_VERIFY: 'PENDING_VERIFY',
};

export type TypeProfile = {
  COMPLETING?: string;
  COMPLETED?: string;
  VERIFIED?: string;
  INVALID?: string;
  PENDING_VERIFY?: string;
};

export const DELETE_ACCOUNT_REASON = {
  OTHER: 'OTHER',
  SOMETHING_IS_BROKEN: 'SOMETHING_IS_BROKEN',
  I_NEED_A_BREAK_FROM_BIDBID: 'I_NEED_A_BREAK_FROM_BIDBID',
  I_DONT_LIKE_BIDBID: 'I_DONT_LIKE_BIDBID',
};

export const LOCATION = {
  NEAR_CURRENT_LOCATION: 'Near Current Location',
};

export const TYPE_CHAT = {
  IS_SENDER: 'IS_SENDER',
  IS_RECEIVER: 'IS_RECEIVER',
};

export const NOTIFICATION_SETTING = {
  NEW_MESSAGE: 'new_message',
  AUCTION_START_OR_END: 'auction_start_or_end',
  WON_AUCTION: 'won_auction',
  LOST_HIGHEST_BID: 'lost_highest_bid',
  MEET_REMINDER: 'meet_reminder',
  CANCEL_MEET: 'cancel_meet',
  PROFILE_WAS_LINKED: 'profile_was_liked',
  PAYMENT: 'payment',
  SYSTEM: 'system',
};

export const NOTIFICATION_TYPE = {
  NEWS: 'news',
  UPDATES: 'updates',
};

export const AUCTION_STATUS = {
  COMPLETED: 'completed',
};

export const AUCTION_PLACE_MEET_CONFIRM_ERROR = {
  OUT_OF_PLACE_RANGE: 'OUT_OF_PLACE_RANGE',
  END_MEET: 'END_MEET',
  OUT_OF_MEET_TIME: 'OUT_OF_MEET_TIME',
};

export const NOTIFICATION_LINK = {
  PAYMENT_SETTING: 'Payment Settings',
  EMAIL_BID_BID: 'support@bidbid.app',
};

export const CONVERSATION_STARTED_MESSAGE = 'Conversation started';
export const ADD_LANGUAGES_KEY = 'Add Languages';
