import { isIOS } from '../devices';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Alert, Linking } from 'react-native';
import { language } from '@/i18n';

export const onCheckPermissionIOS = async (typePermission: any) => {
  if (isIOS) {
    let checkResult = await check(typePermission);
    switch (checkResult) {
      case RESULTS.UNAVAILABLE:
      case RESULTS.BLOCKED:
      case RESULTS.DENIED:
        await hasPermissionIOS(typePermission);
        return;
      default:
        return;
    }
  }
};

const getMessage = (typePermission: any) => {
  switch (typePermission) {
    case PERMISSIONS.IOS.CAMERA:
      return language('cameraPermission');
    case PERMISSIONS.IOS.PHOTO_LIBRARY:
      return language('photoPermission');
    default:
      return '';
  }
};
const hasPermissionIOS = async (typePermission: any) => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert(language('errorMessage.unableSettings'));
    });
  };

  let message = getMessage(typePermission);

  Alert.alert(message, '', [
    { text: language('no'), onPress: () => {}, style: 'destructive' },
    { text: language('yes'), onPress: openSetting },
  ]);
};
