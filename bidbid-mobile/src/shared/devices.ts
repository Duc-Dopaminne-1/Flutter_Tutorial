import { Dimensions, Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const isIphoneX: () => boolean = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height >= 812 || dimen.width >= 812 || dimen.height >= 896 || dimen.width >= 896)
  );
};

export const isIpad: () => boolean = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height >= 812 || dimen.width >= 812 || dimen.height >= 896 || dimen.width >= 896)
  );
};
