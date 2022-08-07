import AsyncStorage from '@react-native-async-storage/async-storage';
import {applyMiddleware, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import {createMigrate, persistReducer} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createEncryptor from 'redux-persist-transform-encrypt';
import thunk from 'redux-thunk';

import Configs from '../../configs';
import logService from '../../service/logService';
import {reducer} from '../reducer';

require('./store.dev.reactotron');

const ENCRYPT_KEY = Configs.redux.REDUX_ENCRYPT_KEY;

const USE_REDUX_DEVTOOLS_DEBUG = true;

const encryptor = createEncryptor({
  secretKey: ENCRYPT_KEY,
  onError: function (error) {
    logService.log(' redux storage error ==', error);
  },
});

const storage = AsyncStorage;

const CURRENT_PERSIST_VERSION = 2;
const migrations = {
  1: () => {
    // migration clear out device state of version -1 because we change the structure of reducer
    return {};
  },
  2: () => {
    // migration clear out device state of version -1 because we change the structure of reducer
    return {};
  },
};

const isDebug = process.env.NODE_ENV === 'development';
const persistConfig = {
  key: 'root',
  version: CURRENT_PERSIST_VERSION,
  migrate: createMigrate(migrations, {debug: isDebug}),
  storage,
  stateReconciler: autoMergeLevel2,
  transforms: [encryptor],
  // whitelist: ['session'], //services. session will be persisted
};
const persistedReducer = persistReducer(persistConfig, reducer);

const middlewares = [thunk];
//other middleWare goes here

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const preloadedState = {};
const appliedWithMiddleware = applyMiddleware(...middlewares);
let enhancer = appliedWithMiddleware;

const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options
});
if (isDebug && USE_REDUX_DEVTOOLS_DEBUG) {
  enhancer = composeEnhancers(appliedWithMiddleware);
}

const createStoreFunction = createStore;

const store = createStoreFunction(
  persistedReducer, // reducer,
  preloadedState,
  enhancer,
);

export {store};
