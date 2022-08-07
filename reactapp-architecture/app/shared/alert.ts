import I18n from '@/i18n'
import { Alert, Keyboard } from 'react-native'

export class CustomAlert {
  static error({
    title = I18n.t('error'),
    message,
    onPress,
  }: {
    title?: string
    message: string
    onPress?: () => void
  }) {
    Alert.alert(
      title,
      message,
      [
        {
          onPress,
          text: I18n.t('goBack'),
        },
      ],
      { cancelable: false }
    )
  }

  static alertYesNo = ({
    title = I18n.t('confirm'),
    message,
    onPressYes,
    onPressNo,
  }: {
    title?: string
    message: string
    onPressYes?: () => void
    onPressNo?: () => void
  }) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: I18n.t('yes'),
          onPress: onPressYes,
          style: 'destructive',
        },
        {
          text: I18n.t('no'),
          onPress: onPressNo,
        },
      ],
      { cancelable: false }
    )
  }

  static alertTimeout = (message: string) => {
    setTimeout(() => {
      Keyboard.dismiss()

      setTimeout(() => {
        alert(message)
      }, 50)
    }, 50)
  }
}
