/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import stripe from 'tipsi-stripe';
import Config from 'react-native-config';
import ZoomUs from 'react-native-zoom-us';
import * as Sentry from '@sentry/react-native';
import codePush from 'react-native-code-push';

if (!__DEV__) {
  Sentry.init({
    dsn: Config.SENTRY,
    environment: Config.ENV,
  });
}

ZoomUs.initialize({
  clientKey: Config.ZOOM_CLIENT_KEY,
  clientSecret: Config.ZOOM_CLIENT_SECRET,
  domain: 'zoom.us',
}).then(_r => {});

stripe.setOptions({
  publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
});
// import './src/config/reactotron';  // open reactotron

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const codePushOptions = {
  checkFrequency: __DEV__ ? codePush.CheckFrequency.MANUAL : codePush.CheckFrequency.ON_APP_RESUME,
  // other options
};

const CodePushedApp = __DEV__ ? App : codePush(codePushOptions)(App);
AppRegistry.registerComponent(appName, () => CodePushedApp);
// AppRegistry.registerComponent(appName, () => App);
