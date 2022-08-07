import Toast from 'react-native-simple-toast';
import I18n from '../i18n';

export default function showToastCopy(
  msg = `${I18n.t('group_topener.copied')}`,
  duration = Toast.SHORT,
  position = Toast.CENTER
) {
  return Toast.showWithGravity(msg, duration, position);
}
