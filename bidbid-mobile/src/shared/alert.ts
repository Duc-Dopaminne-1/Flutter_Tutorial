import { Alert } from 'react-native';
import { AlertMessage } from '@/constants/messageConstants';
import { language } from '@/i18n';
import { FORCE_UPDATE } from '@/constants/app';

export const alertError = (error: string, title = language('alertMessage.TITLE_ERROR'), callback?) => {
  let localizedErrorMessage = error;
  if (error === 'Network Error') {
    localizedErrorMessage = language('networkError');
  }

  Alert.alert(
    title,
    localizedErrorMessage,
    [
      {
        text: language('alert.ok'),
        onPress: () => {
          callback && callback();
        },
        style: 'cancel',
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const alertSoftUpdate = (title = AlertMessage.TITLE_ERROR, content: string, callback, callbackCancel) => {
  Alert.alert(
    title,
    content,
    [
      {
        text: language('alert.update'),
        onPress: () => {
          callback && callback();
        },
        style: 'cancel',
      },
      {
        text: language('alert.cancel'),
        onPress: () => {
          callbackCancel && callbackCancel();
        },
        style: 'cancel',
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const alertForceUpdate = (title = AlertMessage.TITLE_ERROR, content: string, callback?) => {
  Alert.alert(
    title,
    content,
    [
      {
        text: language('alert.update'),
        onPress: () => {
          callback && callback(FORCE_UPDATE);
        },
        style: 'cancel',
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const alertVerify: (title: string, content: string, textButton: string, onPress: () => void) => void = (
  title: string,
  content: string,
  textButton: string,
  onPress: () => void,
) => {
  Alert.alert(
    title,
    content,
    [
      {
        text: language('alert.cancel'),
        onPress: () => undefined,
      },
      {
        text: textButton,
        style: 'destructive',
        onPress: onPress,
      },
    ],
    {
      cancelable: false,
    },
  );
};
