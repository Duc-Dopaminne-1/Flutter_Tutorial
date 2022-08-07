
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
// import stripe from 'tipsi-stripe';
// import { STRIPE_PUBLIC_KEY, ANDROID_PAY_MODE } from 'react-native-config'
import AppWithStore from './App'
if (__DEV__) {
  import('./ReactotronConfig').then();
}

// stripe.setOptions({
//   publishableKey: STRIPE_PUBLIC_KEY,
//   androidPayMode: ANDROID_PAY_MODE
// });


AppRegistry.registerComponent(appName, () => AppWithStore);


// import * as Sentry from '@sentry/react-native';
// import { Client, Configuration, StandardDelivery } from 'bugsnag-react-native';

// const config = new Configuration();
// config.apiKey = Config.BUG_SNAG_API_KEY;
// const endpoint = Platform.OS === 'android' ? "http://10.0.2.2:9999" : "http://localhost:9999";
// config.delivery = new StandardDelivery(endpoint);
// const client = new Client(config);
// client.notify(new Error(`Whoops!`));

// Sentry.init({
//   dsn: Config.SENTRY_DSN,
// });
// throw new Error("My first Sentry error!");
