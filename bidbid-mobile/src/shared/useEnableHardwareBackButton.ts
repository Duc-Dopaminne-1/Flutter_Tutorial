import { useFocusEffect } from '@react-navigation/native';
import NavigationActionsService from '@/navigation/navigation';
import { BackHandler } from 'react-native';

const useEnableHardwareBackButton = () => {
  useFocusEffect(() => {
    const onBackPress = () => {
      NavigationActionsService.goBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  });
};

export default useEnableHardwareBackButton;
