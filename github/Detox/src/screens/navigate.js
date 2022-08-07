import React from 'react';

import {callAfterInteraction} from './commonHooks';

const navigationRef = React.createRef();
const rootNavigationRef = React.createRef();
const setRootNavigationRef = navigation => {
  rootNavigationRef.current = navigation;
};

function resetRootNavigatorToScreen(name, params) {
  const newRoutes = {index: 0, routes: [{name, params}]};
  rootNavigationRef.current?.reset(newRoutes); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
}

const resetNavigatorToScreen = (navigation, screenId, params = {}) => {
  const newRoutes = {index: 0, routes: [{name: screenId, params}]};
  navigation.reset(newRoutes);
};

const resetCurrentNavigatorToScreen = (name, params) => {
  const newRoutes = {index: 0, routes: [{name, params}]};
  navigationRef.current?.reset(newRoutes); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
};

const rootNavigationGoBack = () => {
  const navigation = rootNavigationRef.current;
  navigation?.canGoBack() && navigation?.goBack(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
};

let callbackLoginSuccess;

export const setCallbackLoginSuccess = callback => {
  callbackLoginSuccess = callback;
};

export const excuteCallbackLoginSuccess = () => {
  callAfterInteraction(() => {
    callbackLoginSuccess && callbackLoginSuccess();
    callbackLoginSuccess = null;
  });
};

export {
  navigationRef,
  resetCurrentNavigatorToScreen,
  resetNavigatorToScreen,
  resetRootNavigatorToScreen,
  rootNavigationGoBack,
  rootNavigationRef,
  setRootNavigationRef,
};
