import {AppScreen} from './src/screens/App/AppScreen';
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings([
  'Require cycle:',
  'Module RNFetchBlob',
  'Setting a timer',
]);

export default AppScreen;
