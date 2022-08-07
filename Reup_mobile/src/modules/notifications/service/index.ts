import { DEVICE_ID, DEVICE_NAME, PLATFORM } from '@src/constants/app';
import AsyncStorage from '@react-native-community/async-storage';
import { DEFAULT_AVATAR, CHECK, NOTIFICATION } from '@src/constants/icons';
import { NOTIFICATIONS } from '@src/constants/screenKeys';
// import { Navigation } from 'react-native-navigation';
import { PlatForm } from '@reup/reup-api-sdk/libs/type';
import { Platform, AppState } from 'react-native';
import firebase from 'react-native-firebase';
import { isAndroid } from '@src/utils';
import { getAppInfo } from '@src/services/init';

const notification = firebase.notifications();

export default class NotificationsService {
  notificationListener!: () => any;

  notificationOpenedListener!: () => any;

  messageListener!: () => any;

  updateNotificationBadge: (badge: string) => void;

  getBadge: (callBack: Function) => void;

  onNotificationOpenned: (data: any) => void;

  onUpdateBadge: () => void;

  registerToken: (
    deviceName: string,
    registrationID: string,
    deviceID: string,
    type: PlatForm
  ) => void;

  // UnregisterToken: () => void;

  token: any;

  store: any;

  total: number;

  private static _instance: NotificationsService;

  static initInstance(store: any, notificationAction: any) {

    if (NotificationsService._instance == null) {
      NotificationsService._instance = new NotificationsService(
        store,
        notificationAction
      );
    } else {
      NotificationsService._instance.store = store;
      NotificationsService._instance.token = null;
      NotificationsService._instance.total = 0;
      NotificationsService._instance.updateNotificationBadge =
        notificationAction.updateNotificationBadge;
      NotificationsService._instance.getBadge = notificationAction.getBadge;
      NotificationsService._instance.getBadge(
        NotificationsService._instance.setBadge
      );
      NotificationsService._instance.registerToken =
        notificationAction.registerToken;
      NotificationsService._instance.checkPermission();
      NotificationsService._instance.onUpdateBadge = notificationAction.onUpdateBadge;
    }
    return this._instance;
  }

  private constructor(store: any, notificationAction: any) {
    this.store = store;
    this.updateNotificationBadge = notificationAction.updateNotificationBadge;
    this.token = null;
    this.total = 0;
    this.getBadge = notificationAction.getBadge;
    this.registerToken = notificationAction.registerToken;
    this.onNotificationOpenned = notificationAction.onNotificationOpenned;
    this.getBadge(this.setBadge);
    this.checkPermission();
    this.createNotificationListeners();
    this.addEventListener();
    this.onUpdateBadge = notificationAction.onUpdateBadge;
  }

  setBadge = (number: string) => {
    // Navigation.mergeOptions(`TAB-${NOTIFICATIONS}`, {
    //   bottomTab: {
    //     badge: number,
    //     badgeColor: 'red',
    //     icon: NOTIFICATION,
    //   },
    // });
  };

  addEventListener() {
    this.store.subscribe(this.onStoreUpdate);
  }

  async getToken() {
    let fcmToken;
    try {
      fcmToken = await AsyncStorage.getItem("fcmToken");
    } catch (error) {

    }
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      const appInfo = await getAppInfo();
      this.token = fcmToken;
      if (fcmToken) {
        // User has a device token
        this.registerToken(
          appInfo.DEVICE_NAME,
          fcmToken,
          appInfo.DEVICE_ID,
          PLATFORM
        );
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    }
  }

  onStoreUpdate = () => {
    const { currentState } = this.store.getState().appState;
    const total = this.store.getState().notifications.notificationInfo.badge;
    if (currentState === 'active' && total && total !== this.total) {
      this.updateNotifications();
    }
  };

  updateNotifications() {
    const total = this.store.getState().notifications.notificationInfo.badge;
    this.total = total;
    const isDisplayNotificationBadge = total > 0;
    notification.setBadge(total || 0);
    this.updateNotificationBadge(isDisplayNotificationBadge ? total.toString() : '');
  }

  static clearBadge() {
    notification.setBadge(0);
  }

  clearBadge() {
    notification.setBadge(0);
  }

  // Grant permissions to push notifications
  async checkPermission() {
    try {
      await firebase
        .messaging()
        .hasPermission()
        .then(enabled => {
          if (enabled) {
            this.getToken();
            // User has permissions
          } else {
            this.requestPermission();
            // User doesn't have permission
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  /*
   * Get token firebase
   * async getToken() {
   *   let fcmToken = await AsyncStorage.getItem('fcmToken');
   *   if (!fcmToken) {
   *       fcmToken = await firebase.messaging().getToken();
   *       this.token = fcmToken;
   *       if (fcmToken) {
   *           // user has a device token
   *           this.registerToken(DEVICE_NAME, fcmToken, DEVICE_ID, PLATFORM);
   *           await AsyncStorage.setItem('fcmToken', fcmToken);
   *       }
   *   }
   * }
   */

  // If the user has not already granted permissions, then you can prompt them to do so
  async requestPermission() {
    try {
      await firebase
        .messaging()
        .requestPermission()
        .then(() => {
          // User has authorized
          this.getToken();
        })
        .catch(() => {
          // User has rejected permissions
          console.log('permission rejected');
        });
    } catch (error) {
      console.log(error);
    }
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     *
     */

    // Optional 1: Basic pop-up notifications from firebase (Note: Only support drop down pop up for android version > 8.0)
    this.notificationListener = firebase.notifications().onNotification(async notifications => {
      if (AppState.currentState == "active") {
        this.onUpdateBadge();
        if (!isAndroid()) {
          const notify = new firebase.notifications.Notification()
            .setNotificationId(notifications.notificationId)
            .setTitle(notifications.title)
            .setBody(notifications.body)
            .setData(notifications.data);
          await firebase.notifications().displayNotification(notify);
        }
        if (isAndroid()) {
          const channel = new firebase.notifications.Android.Channel(
            'test-channel',
            'Test Channel',
            firebase.notifications.Android.Importance.High,
          ).setDescription('My apps test channel');
          // Create the channel
          await firebase.notifications().android.createChannel(channel);
          const notify = new firebase.notifications.Notification().setTitle(notifications.title).setBody(notifications.body);
          notify.android.setChannelId(channel.channelId).setSound('default');
          await firebase.notifications().displayNotification(notify);
        }
      }
    });

    /*
     * Optional 2 : You can custom your pop-up local notification (on Notification Class)
     *  this.notificationListener = firebase
     *      .notifications()
     *      .onNotification(notification => {
     *          const { title, body } = notification;
     *          // this.showAlert(title, body);
     *          let mess = {
     *              id: '3',
     *              code: "CODE",
     *              type: "information",
     *              message: body,
     *              title
     *          }
     *          // NotificationActions.addNotification(mess);
     *          this.store.dispatch(NotificationActions.addNotification(mess));
     *      });
     */

    // ============================================================================//
    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     *
     */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async notificationOpen => {
      const badgeCount = await notification.getBadge();
      notification.setBadge(badgeCount - 1);
      /*
       * Const { title, body } = notificationOpen.notification;
       * this.showAlert(title, body);
       */
      this.onNotificationOpenned(notificationOpen.notification.data);
    });

    // ============================================================================//
    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     *
     */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const badgeCount = await notification.getBadge();
      notification.setBadge(badgeCount - 1);
      /*
       * Const { title, body } = notificationOpen.notification;
       *   this.showAlert(title, body);
       */
      this.onNotificationOpenned(notificationOpen.notification.data);
    }
    /*
     * Triggered for data only payload in foreground
     *
     */
    this.messageListener = firebase.messaging().onMessage(() => {
      // Process data message
    });
  }
}
