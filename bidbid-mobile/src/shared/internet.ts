import { Alert } from 'react-native';
import { language } from '@/i18n';

class CheckInternet {
  isInternet = true;

  setStatus(status: boolean) {
    this.isInternet = status;
  }

  processFunction = (func: any, callback?: () => void) => {
    if (!this.isInternet) {
      callback && callback();
      Alert.alert(language('oop'), language('noInternet'));
      return;
    }
    func && func();
  };
}

export const checkInternet = new CheckInternet();
