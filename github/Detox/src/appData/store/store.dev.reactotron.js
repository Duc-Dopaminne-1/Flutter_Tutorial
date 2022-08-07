import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';

import {DebugConfig} from '../../configs/DebugConfig';

Reactotron.configure({
  name: 'TopenLand',
  host: DebugConfig.devHost,
  socketIoProperties: {
    reconnection: false,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
  },
})
  .use(reactotronRedux())
  .useReactNative({
    storybook: true,
  });

if (__DEV__) {
  // eslint-disable-next-line no-console
  console.tron = Reactotron;
  Reactotron.connect(); // let's connect!
}
