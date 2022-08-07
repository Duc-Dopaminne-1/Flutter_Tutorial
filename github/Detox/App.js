/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {Platform, UIManager} from 'react-native';
import Config from 'react-native-config';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {Provider as ReduxProvider} from 'react-redux';

import withApollo from './api/graphql/withApollo';
import {AppProvider} from './appData/appContext/useAppContext';
import {store} from './appData/store';
import AppNavigator from './screens/AppNavigator';
import {useMount} from './screens/commonHooks';
import {TPFClient} from './screens/TPF/hooks/useTPFClient';
import WithAppState from './screens/WithAppState';
import WithDeepLinking from './screens/WithDeepLinking';
import WithOneSignal from './screens/WithOneSignal';
import WithSegment from './screens/WithSegment';
import {handleAndroidNotification} from './service/stringee/handleAndroidNotification';
import {avoidFontScale} from './utils/avoidFontScale';

avoidFontScale();

if (Platform.OS === 'android') {
  handleAndroidNotification();

  // enable animation for android
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const AppWithOneSignal = () => WithOneSignal(AppNavigator);
const AppNavigatorWithApollo = () => withApollo(AppWithOneSignal);
const AppWithDeepLinking = () => WithDeepLinking(AppNavigatorWithApollo);
const AppWithSegment = () => WithSegment(AppWithDeepLinking);
const AppWithAppState = () => WithAppState(AppWithSegment);

const App = () => {
  const [enableStoryBook, setEnableStorybook] = useState(null);

  useMount(() => {
    if (__DEV__) {
      const DevMenu = require('react-native-dev-menu');
      const KEY_ENABLE_STORYBOOK = 'KEY_ENABLE_STORYBOOK';

      DevMenu.addItem('Storybook', () => {
        setEnableStorybook(prevState => {
          const nextState = !prevState;
          AsyncStorage.setItem(
            KEY_ENABLE_STORYBOOK,
            nextState ? 'true' : 'false',
          );
          return nextState;
        });
      });

      AsyncStorage.getItem(KEY_ENABLE_STORYBOOK).then(value => {
        if (!value && Config.IS_TEST_IMAGE_SNAPSHOT === 'true') {
          setEnableStorybook(true);
        } else {
          setEnableStorybook(value === 'true');
        }
      });
    }
  });

  if (__DEV__) {
    if (enableStoryBook === null) {
      return null;
    } else if (enableStoryBook === true) {
      SplashScreen.hide();
      const Storybook = require('../storybook').default;
      return <Storybook />;
    }
  }

  return (
    <>
      <TPFClient />
      <ReduxProvider store={store}>
        <AppProvider>
          <AppWithAppState />
        </AppProvider>
      </ReduxProvider>
      <Toast ref={ref => Toast.setRef(ref)} />
    </>
  );
};

export default App;
