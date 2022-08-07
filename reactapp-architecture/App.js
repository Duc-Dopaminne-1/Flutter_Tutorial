import { AppContainer } from '@/screens/App/AppContainer'
import { YellowBox } from 'react-native'
import './app/utils/customString'
import './app/utils/customArray'
import 'react-native-console-time-polyfill'

YellowBox.ignoreWarnings([
  'Require cycle:',
  'Module RNFetchBlob',
  'Setting a timer',
])

export default AppContainer
