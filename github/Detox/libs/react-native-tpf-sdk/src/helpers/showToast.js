import Toast from 'react-native-simple-toast';
import { translate } from '../i18n';

export default function showToast(
  msg = `${translate('common.downloading')}...`,
  duration = Toast.SHORT,
  position = Toast.TOP
) {
  return Toast.showWithGravity(msg, duration, position);
}
