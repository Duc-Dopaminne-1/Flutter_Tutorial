import { Alert } from 'react-native';
import I18n from 'app/i18n'

export const alert = text => {
  setTimeout(() => {
    Alert.alert(I18n.t('error'), text, [{ text: I18n.t('ok') }], { cancelable: false });
  }, 400)
};

export const success = text => {
  setTimeout(() => {
    Alert.alert(I18n.t('success'), text, [{ text: I18n.t('ok') }], { cancelable: false });
  }, 400)
};
