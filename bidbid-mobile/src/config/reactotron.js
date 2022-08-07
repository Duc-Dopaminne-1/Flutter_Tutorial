import Reactotron from 'reactotron-react-native';
import { NativeModules } from 'react-native';

if (__DEV__) {
  console.log = Reactotron.log;
  const { scriptURL } = NativeModules.SourceCode;
  // android run this command: adb reverse tcp:9090 tcp:9090
  const host = Platform.select({
    ios: 'localhost', // scriptURL.split('://')[1].split(':')[0],
    android: 'localhost',
  });
  Reactotron.configure({ host }).useReactNative().connect();
}
