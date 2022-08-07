import { Alert } from 'react-native'
import I18n from '@/i18n'

export function confirmDialog({
  title = I18n.t('confirm'),
  message = '',
  leftTitle = I18n.t('cancel'),
  rightTitle = I18n.t('ok'),
  onPressLeft = () => {},
  onPressRight = () => {},
}) {
  Alert.alert(
    title,
    message,
    [
      {
        text: leftTitle,
        onPress: onPressLeft,
      },
      {
        text: rightTitle,
        onPress: onPressRight,
      },
    ],
    {
      cancelable: false,
    }
  )
}
