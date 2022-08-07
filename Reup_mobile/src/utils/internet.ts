import { Alert } from "react-native";

class CheckInternet {
  isInternet = true

  setStatus(status: boolean) {
    this.isInternet = status;
  }

  processFunction = (func: any, callback?: () => void) => {
    if (!this.isInternet) {
      callback && callback();
      Alert.alert('Oops!', 'Your Internet connection appears to be offline or too weak. Please try again later.');
      return;
    }
    func && func();
  }
}

export const checkInternet = new CheckInternet();
