import RNNotification from 'react-native-push-notification'
import { PushNotificationIOS } from 'react-native'
import { Subscription } from 'rxjs'

export class PushNotification {
  public _snapBusinessCardSubscription: Subscription

  constructor() {
    this.init()
  }

  init = () => {
    RNNotification.configure({
      onNotification: this.onNotification,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    })
  }

  onNotification = notification => {
    notification.finish(PushNotificationIOS.FetchResult.NoData)
    this._snapBusinessCardSubscription &&
      this._snapBusinessCardSubscription.unsubscribe()
  }

  pushNotification = (message: string) => {
    RNNotification.localNotification({
      message,
      playSound: false,
    })
  }
}

export const pushNotification = new PushNotification()
