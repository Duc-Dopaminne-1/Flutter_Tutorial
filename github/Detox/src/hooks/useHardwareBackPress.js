import {useAndroidBackHandler} from 'react-navigation-backhandler';

import {rootNavigationGoBack} from '../screens/navigate';

export const useHardwareBackPress = onBackPress => {
  const onBackPressHandler = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      rootNavigationGoBack();
    }
    return true;
  };
  useAndroidBackHandler(onBackPressHandler);
  return {onBackPressHandler};
};
