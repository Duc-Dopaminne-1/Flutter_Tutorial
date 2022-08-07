import { NativeModules, Platform } from 'react-native'
import Reactotron from 'reactotron-react-native'

console.tron = console.log

if (__DEV__) {
  console.tron = Reactotron.log
  const scriptURL = NativeModules.SourceCode.scriptURL

  // android run this command: adb reverse tcp:9090 tcp:9090
  const host = Platform.select({
    ios: scriptURL.split('://')[1].split(':')[0],
    android: 'localhost',
  })

  Reactotron.configure({ host }) // controls connection &
    // communication settings
    .useReactNative() // add all built-in react native plugins
    .connect() // let's connect!
}

// path image /Users/linh/Library/Developer/CoreSimulator/Devices/5791096D-4ADA-42CE-8C89-9EA0AC9966E7/data/
