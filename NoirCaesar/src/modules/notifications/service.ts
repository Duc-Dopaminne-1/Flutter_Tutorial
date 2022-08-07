import { Platform, AppStateStatus } from 'react-native';
import { getBadge, registerToken, getNotificationsDetail, markAsReadAll } from './notification/actions';
import firebase, { RNFirebase } from 'react-native-firebase';
import store from '@src/redux/store';
import { DEVICE_NAME, DEVICE_ID, PLATFORM } from '@src/constants/app';
import AsyncStorage from '@react-native-community/async-storage';
import { RegisterDeviceParam } from '@goldfishcode/noir-caesar-api-sdk/libs/api/notification';
import { updateProfile } from '../auth/actions';
import { get } from 'lodash';
import { IError } from '../base';
import NavigationActionsService from '@src/navigation/navigation';
import { INotificationDetail } from '@goldfishcode/noir-caesar-api-sdk/libs/api/notification/models';
import {
  BOOK_INFO_DETAIL,
  BLOG_DETAIL,
  PROFILE,
  PROFILE_OTHERS,
  SHOP,
  TELEVISION,
  MESSAGE,
  CHANNEL,
  VIDEO_DETAIL,
} from '@src/constants/screenKeys';
import { ChannelType } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';
import { getProfileDetail } from '../user/actions';

const notification = firebase.notifications();

export enum DeepLinkType {
  DEEP_LINK_OBJECT_USER = '1',
  DEEP_LINK_OBJECT_COMMENT = '2',
  DEEP_LINK_OBJECT_BLOG = '3',
  DEEP_LINK_OBJECT_BOOK = '4',
  DEEP_LINK_OBJECT_CHAPTER = '5',
  DEEP_LINK_OBJECT_STORY = '6',
  DEEP_LINK_OBJECT_EPISODE = '7',
  DEEP_LINK_OBJECT_PRODUCT = '8',
  DEEP_LINK_OBJECT_COIN_TRANSACTION = '9',
  DEEP_LINK_CHAT_TYPE = '10',
  DEEP_LINK_NOTIFICATION_TYPE = '11',
  DEEP_LINK_CHAT_GROUP_TYPE = '12',
}

export default class NotificationsService {
  private static _instance: NotificationsService;

  notificationOpenedListener: () => any;
  notificationListener: () => any;
  notificationPermissionGranted: boolean;
  notificationServiceInitialized: boolean;
  notificationOnAppInitialized: boolean;
  currentChannelId: string;
  notificationChannel: RNFirebase.notifications.Android.Channel;
  storyTab?: string;

  setCurrentChannelId(id: string) {
    this.currentChannelId = id;
  }

  setStoryTab(value?: string) {
    this.storyTab = value;
  }

  constructor() {
    this.notificationPermissionGranted = false;
    this.notificationServiceInitialized = false;
    this.notificationOnAppInitialized = false;
  }

  static getInstance(): NotificationsService {
    if (!NotificationsService._instance) {
      NotificationsService._instance = new NotificationsService();
    }
    return NotificationsService._instance;
  }

  initService() {
    if (!this.notificationServiceInitialized) {
      this.checkPermission();
    }
  }

  onAppStateChange(nextAppState: AppStateStatus) {
    if (nextAppState === 'active') {
      this.checkPermission();
      this.markReadAllNotifications();
      this.clearNotification();
    }
    if (nextAppState === 'inactive' || nextAppState === 'background') {
      this.doGetBadge();
    }
  }

  isNotificationPermissionGranted() {
    return this.notificationPermissionGranted;
  }

  isNotificationServiceInitialized() {
    return this.notificationServiceInitialized;
  }

  /* ============================== Notifications Permission + Token ============================== */
  checkPermission() {
    firebase
      .messaging()
      .hasPermission()
      .then(permission => {
        if (permission) {
          this.doSaveNotificationPermission(true);
          this.doGetFCMToken();
        } else this.requestPermission();
      })
      .catch(error => {
        console.log('NotificationsService.checkPermission(): error=', error);
        this.doSaveNotificationPermission(false);
      });
  }

  async requestPermission() {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.doSaveNotificationPermission(true);
        this.doGetFCMToken();
      })
      .catch(error => {
        console.log('NotificationsService.requestPermission(): error=', error);
        this.doSaveNotificationPermission(false);
      });
  }

  async doGetFCMToken() {
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      const token = await firebase.messaging().getToken();
      if (token) {
        const param: RegisterDeviceParam = {
          name: await DEVICE_NAME,
          registration_id: token,
          device_id: DEVICE_ID,
          type: PLATFORM,
        };
        this.handleRegisterToken(param, token);
      }
    } else {
      this.initNotification();
    }
  }

  handleRegisterToken(param: RegisterDeviceParam, token: string) {
    store.dispatch(
      registerToken({
        param,
        onSuccess: () => {
          AsyncStorage.setItem('fcmToken', token);
          this.initNotification();
        },
        onFail: error => {
          console.log('NotificationsService.handleRegisterToken(): error=', error);
        },
      }),
    );
  }
  /* ============================== End Notifications Permission + Token ============================== */

  /* ============================== Notification Badge ============================== */
  doGetBadge() {
    store.dispatch(
      getBadge({
        onSuccess: badge => {
          this.updateNotificationBadge(badge);
        },
      }),
    );
  }

  updateNotificationBadge(total: number) {
    if (Platform.OS === 'ios') {
      // On Android we can't set badge for notification
      notification && notification.setBadge(total || 0);
    }
  }

  clearBadge() {
    notification.setBadge(0);
  }
  /* ============================== End Notification Badge ============================== */

  /* ============================== Notifications ============================== */
  handleNotificationOpen(notification: RNFirebase.notifications.Notification) {
    const { data } = notification;
    if (data && data.t && data.id) {
      const { t, id, n } = data;
      switch (t) {
        case DeepLinkType.DEEP_LINK_NOTIFICATION_TYPE:
          this.getNotificationsDetail(id);
          break;
        case DeepLinkType.DEEP_LINK_CHAT_TYPE:
          this.doOpenScreen(MESSAGE, { channelId: id, isFromChannel: false, displayName: n, channelType: ChannelType.ONE_ONE });
          break;
        case DeepLinkType.DEEP_LINK_CHAT_GROUP_TYPE:
          this.doOpenScreen(MESSAGE, { channelId: id, isFromChannel: false, displayName: n, channelType: ChannelType.GROUP });
          break;
      }
    }
  }

  openStory(data: any) {
    if (data && data.categories_name) {
      this.storyTab = data.categories_name;
      this.doChangeMainBottomTab(TELEVISION);
    }
  }

  openEpisode(data: any) {
    if (data && data.categories_name && data.story_id) {
      const { categories_name, story_id } = data;
      if (categories_name === 'Podcast' || categories_name === 'Music') {
        this.storyTab = categories_name;
        this.doChangeMainBottomTab(TELEVISION);
      } else {
        this.doOpenScreen(VIDEO_DETAIL, { story_id, navigateToTab: 1 });
      }
    }
  }

  doGetProfileDetail(id: string) {
    NavigationActionsService.showLoading();
    store.dispatch(getProfileDetail({
      user_id: id,
      onSuccess: () => {
        setTimeout(() => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.push(PROFILE_OTHERS, { user_id: id }, true);
        }, 500);
      },
      onFail: error => {
        setTimeout(() => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.showErrorPopup(error);
        }, 500);
      }
    }));
  }

  getNotificationsDetail(notificationId: string) {
    store.dispatch(
      getNotificationsDetail({
        notificationId,
        onSuccess: (response: INotificationDetail) => {
          const { payload, verb } = response;
          if (payload) {
            const { id, t, data } = payload;
            switch (t) {
              case DeepLinkType.DEEP_LINK_OBJECT_BOOK:
                if (verb === 'Publish') {
                  this.doOpenScreen(BOOK_INFO_DETAIL, { bookId: id });
                } else if (verb === 'Comment') {
                  this.doOpenScreen(BOOK_INFO_DETAIL, { bookId: id, navigateToTab: 2 });
                }
                break;
              case DeepLinkType.DEEP_LINK_OBJECT_CHAPTER:
                if (data && data.bookID) {
                  this.doOpenScreen(BOOK_INFO_DETAIL, { bookId: data.bookID, navigateToTab: 1 });
                }
                break;
              case DeepLinkType.DEEP_LINK_OBJECT_BLOG:
                this.doOpenScreen(BLOG_DETAIL, { blog_id: id });
                break;
              case DeepLinkType.DEEP_LINK_OBJECT_STORY:
                this.openStory(data);
                break;
              case DeepLinkType.DEEP_LINK_OBJECT_EPISODE:
                this.openEpisode(data);
                break;
              case DeepLinkType.DEEP_LINK_OBJECT_USER:
                this.doGetProfileDetail(id);
                break;
              case DeepLinkType.DEEP_LINK_OBJECT_PRODUCT:
                this.doChangeMainBottomTab(SHOP);
                break;
              case DeepLinkType.DEEP_LINK_OBJECT_COIN_TRANSACTION:
                this.doOpenScreen(PROFILE);
                break;
            }
          }
        },
      }),
    );
  }

  doSaveNotificationPermission(value: boolean) {
    this.notificationPermissionGranted = value;
    if (!this.notificationPermissionGranted) {
      store.dispatch(updateProfile({ data: { notifications: false } }));
    }
  }

  clearNotification() {
    notification.removeAllDeliveredNotifications();
  }

  markReadAllNotifications() {
    store.dispatch(
      markAsReadAll({
        onSuccess: () => {
          this.doGetBadge();
        },
      }),
    );
  }

  initNotification() {
    if (!this.notificationServiceInitialized) {
      this.createNotificationListeners();
      this.doGetBadge();

      this.notificationServiceInitialized = true;
    }
  }

  unRegisterNotificationListeners() {
    this.notificationListener && this.notificationListener();
    this.notificationOpenedListener && this.notificationOpenedListener();

    this.notificationServiceInitialized = false;
  }

  isAllowNotification(type: string, channelId: string) {
    const me = store.getState().auth.userData;
    const allowNotification = get(me, ['notifications'], false);

    if (!this.notificationPermissionGranted || !allowNotification) {
      return false;
    }

    if (type === DeepLinkType.DEEP_LINK_CHAT_TYPE || type === DeepLinkType.DEEP_LINK_CHAT_GROUP_TYPE) {
      if (NavigationActionsService.screenName === CHANNEL) {
        return false;
      }

      if (NavigationActionsService.screenName === MESSAGE && this.currentChannelId === channelId) {
        return false;
      }
    }

    return true;
  }

  async createNotificationListeners() {
    this.notificationListener = firebase.notifications().onNotification(async notifications => {
      const { data } = notifications;
      if (!data) return;
      const { id, t } = data;

      const allowNotification = this.isAllowNotification(t, id);
      if (!allowNotification) {
        return;
      }

      if (Platform.OS === 'ios') {
        const notification = new firebase.notifications.Notification()
          .setNotificationId(notifications.notificationId)
          .setTitle(notifications.title)
          .setBody(notifications.body)
          .setSubtitle(notifications.subtitle ? notifications.subtitle : '')
          .setData(notifications.data);
        firebase.notifications().displayNotification(notification);
      }

      if (Platform.OS === 'android') {
        if (!this.notificationChannel) {
          const channel = new firebase.notifications.Android.Channel(
            'noir-caesar-notification-channel',
            'Noir Caesar',
            firebase.notifications.Android.Importance.High,
          ).setDescription('Noir Caesar channel');
          // Create the channel
          firebase.notifications().android.createChannel(channel);

          this.notificationChannel = channel;
        }

        const notification = new firebase.notifications.Notification()
          .setNotificationId(notifications.notificationId)
          .setTitle(notifications.title)
          .setBody(notifications.body)
          .setData(notifications.data);
        notification.android.setChannelId(this.notificationChannel.channelId).setSound('default');
        firebase.notifications().displayNotification(notification);
      }
      this.doGetBadge();
    });

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async notificationOpen => {
      this.handleNotificationOpen(notificationOpen.notification);
      this.clearNotification();
    });

    if (!this.notificationOnAppInitialized) {
      this.notificationOnAppInitialized = true;

      const notificationOpen = await firebase.notifications().getInitialNotification();
      if (notificationOpen) {
        this.handleNotificationOpen(notificationOpen.notification);
        this.clearNotification();
      }
    }
  }
  /* ============================== End Notifications ============================== */

  /* ============================== Navigation ============================== */
  doOpenScreen(screenName: string, passProps = {}, drawBehind = true, useAnimate = true) {
    NavigationActionsService.toggleDrawer(false);
    NavigationActionsService.popToRoot();
    NavigationActionsService.dismissAllModal();
    setTimeout(() => {
      NavigationActionsService.push(screenName, passProps, drawBehind, useAnimate);
    }, 1000);
  }

  doOpenModal(screenName: string, passProps = {}) {
    NavigationActionsService.toggleDrawer(false);
    NavigationActionsService.popToRoot();
    NavigationActionsService.dismissAllModal();
    setTimeout(() => {
      NavigationActionsService.showModal(screenName, passProps);
    }, 1000);
  }

  doChangeMainBottomTab(tabName: string) {
    NavigationActionsService.toggleDrawer(false);
    NavigationActionsService.popToRoot();
    NavigationActionsService.dismissAllModal();
    setTimeout(() => {
      NavigationActionsService.mergeOptions(tabName);
    }, 1000);
  }
}
