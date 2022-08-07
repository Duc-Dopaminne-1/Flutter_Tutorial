import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import middleware from './middleware';
import auth from './auth';
import banner from './banner';
import cashout from './cashout';
import contact from './contact';
import credit from './credit';
import deposit from './deposit';
import event from './event';
import extraService from './extraService';
import faq from './faq';
import insurance from './insurance';
import invoice from './invoice';
import lead from './lead';
import loading from './loading';
import masterData from './masterData';
import member from './member';
import news from './news';
import notification from './notifications';
import offer from './offer';
import order from './order';
import partner from './partner';
import payment from './payment';
import profit from './profit';
import saleKit from './saleKit';
import schedule from './schedule';
import setting from './settings';
import system from './system';
import termAndCondition from './termAndCondition';
import toggleFeature from './toggleFeature';
import workflow from './workflow';
import groupTopener from './groupTopener';
import kpi from './kpi';
import link from './link';

const systemPersistConfig = {
  key: 'system',
  storage: AsyncStorage,
  whitelist: [],
  version: 1.0
};

const masterDataPersistConfig = {
  key: 'masterData',
  storage: AsyncStorage,
  whitelist: ['bank', 'region'],
  version: 1.0
};

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: [
    'accessToken',
    'refreshToken',
    'tokenExpire',
    'memberId',
    'topenId',
    'role',
    'isRead',
    'isLogin',
    'expired',
    'hasLocalPIN',
    'localPIN',
    'faceIDs',
    'touchIDs',
    'bypassPinCode'
  ],
  version: 1.0
};

const eventPersistConfig = {
  key: 'event',
  storage: AsyncStorage,
  whitelist: ['highlightEvents', 'event'],
  version: 1.0
};

const schedulePersistConfig = {
  key: 'schedule',
  storage: AsyncStorage,
  whitelist: [],
  version: 1.0
};

const bannerPersistConfig = {
  key: 'banner',
  storage: AsyncStorage,
  whitelist: ['list'],
  version: 1.0
};

const newsPersistConfig = {
  key: 'news',
  storage: AsyncStorage,
  whitelist: ['highlightNews', 'news'],
  version: 1.0
};

const offerPersistConfig = {
  key: 'offer',
  storage: AsyncStorage,
  whitelist: ['highlightOffers', 'offerList', 'eventCount', 'event'],
  version: 1.0
};

const paymentPersistConfig = {
  key: 'payment',
  storage: AsyncStorage,
  whitelist: ['generateLinkResult', 'responsePaymentData'],
  version: 1.0
};

const fqaPersistConfig = {
  key: 'fqa',
  storage: AsyncStorage,
  whitelist: ['faqList'],
  version: 1.0
};
const contactPersistConfig = {
  key: 'contact',
  storage: AsyncStorage,
  whitelist: ['list', 'totalCount'],
  version: 1.0
};

const memberPersistConfig = {
  key: 'member',
  storage: AsyncStorage,
  whitelist: [
    'profile',
    'hideBalance',
    'agencyInformation',
    'subcriptionTopeners',
    'policySubscription',
    'memberProfile',
    'renewalTopenerResult',
    'topenIdProfile'
  ],
  version: 1.0
};

const saleKitPersistConfig = {
  key: 'saleKit',
  storage: AsyncStorage,
  whitelist: [],
  version: 1.0
};

const profitPersistConfig = {
  key: 'profit',
  storage: AsyncStorage,
  whitelist: ['profitList', 'profitCount'],
  version: 1.0
};

const termAndConditionPersistConfig = {
  key: 'termAndCondition',
  storage: AsyncStorage,
  whitelist: ['termAndConditionList', 'termAndConditionCount'],
  version: 1.0
};

const partnerPersistConfig = {
  key: 'partner',
  storage: AsyncStorage,
  whitelist: ['list', 'totalCount'],
  version: 1.0
};

const leadPersistConfig = {
  key: 'lead',
  storage: AsyncStorage,
  whitelist: [],
  version: 1.0
};

const workflowPersistConfig = {
  key: 'workflow',
  storage: AsyncStorage,
  whitelist: ['workflowData'],
  version: 1.0
};

const creditPersistConfig = {
  key: 'credit',
  storage: AsyncStorage,
  whitelist: ['productFilter'],
  version: 1.0
};

const orderPersistConfig = {
  key: 'order',
  storage: AsyncStorage,
  whitelist: [],
  version: 1.0
};

const insurancePersistConfig = {
  key: 'insurance',
  storage: AsyncStorage,
  whitelist: [
    'insuranceCategoriesList',
    'insuranceCategoriesTotalCount',
    'highlightInsuranceCategory',
    'insuranceProductDetail'
  ],
  version: 1.0
};

const extraServicePersistConfig = {
  key: 'extraService',
  storage: AsyncStorage,
  whitelist: ['list', 'totalCount'],
  version: 1.0
};

const invoicePersistConfig = {
  key: 'invoice',
  storage: AsyncStorage,
  whitelist: [
    'createOrEditInvoiceResult',
    'invoiceList',
    'invoiceTotalCount',
    'transactionList',
    'transactionTotalCount'
  ],
  version: 1.0
};

const settingPersistConfig = {
  key: 'setting',
  storage: AsyncStorage,
  whitelist: ['lang'],
  version: 1.0
};

const notificationPersistConfig = {
  key: 'notification',
  storage: AsyncStorage,
  whitelist: ['settingNotification'],
  version: 1.0
};

const depositPersistConfig = {
  key: 'deposit',
  storage: AsyncStorage,
  whitelist: [],
  version: 1.0
};

const cashoutPersistConfig = {
  key: 'cashout',
  storage: AsyncStorage,
  whitelist: ['createTransaction'],
  version: 1.0
};

const toggleFeaturePersistConfig = {
  key: 'toggleFeature',
  storage: AsyncStorage,
  whitelist: ['featureList'],
  version: 1.0
};
const groupTopenerPersistConfig = {
  key: 'groupTopener',
  storage: AsyncStorage,
  whitelist: [],
  version: 1.0
};
const kpiPersistConfig = {
  key: 'kpi',
  storage: AsyncStorage,
  whitelist: [],
  version: 1.0
};

export default combineReducers({
  middleware,
  schedule: persistReducer(schedulePersistConfig, schedule),
  //auth: persistReducer(authPersistConfig, auth),
  auth,
  system: persistReducer(systemPersistConfig, system),
  masterData: persistReducer(masterDataPersistConfig, masterData),
  event: persistReducer(eventPersistConfig, event),
  banner: persistReducer(bannerPersistConfig, banner),
  news: persistReducer(newsPersistConfig, news),
  offer: persistReducer(offerPersistConfig, offer),
  payment: persistReducer(paymentPersistConfig, payment),
  loading,
  member: persistReducer(memberPersistConfig, member),
  contact: persistReducer(contactPersistConfig, contact),
  faq: persistReducer(fqaPersistConfig, faq),
  saleKit: persistReducer(saleKitPersistConfig, saleKit),
  profit: persistReducer(profitPersistConfig, profit),
  termAndCondition: persistReducer(termAndConditionPersistConfig, termAndCondition),
  partner: persistReducer(partnerPersistConfig, partner),
  lead: persistReducer(leadPersistConfig, lead),
  workflow: persistReducer(workflowPersistConfig, workflow),
  order: persistReducer(orderPersistConfig, order),
  credit: persistReducer(creditPersistConfig, credit),
  insurance: persistReducer(insurancePersistConfig, insurance),
  invoice: persistReducer(invoicePersistConfig, invoice),
  extraService: persistReducer(extraServicePersistConfig, extraService),
  setting: persistReducer(settingPersistConfig, setting),
  notification: persistReducer(notificationPersistConfig, notification),
  cashout: persistReducer(cashoutPersistConfig, cashout),
  deposit: persistReducer(depositPersistConfig, deposit),
  toggleFeature: persistReducer(toggleFeaturePersistConfig, toggleFeature),
  groupTopener: persistReducer(groupTopenerPersistConfig, groupTopener),
  kpi: persistReducer(kpiPersistConfig, kpi),
  link
});
