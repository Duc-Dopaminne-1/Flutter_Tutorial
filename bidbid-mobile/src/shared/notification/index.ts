import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';
import { get, set } from '@/services/storage';
import { FCM_TOKEN, TIME_LOAD_SPLASH_SCREEN } from '@/constants/app';
import NavigationActionsService from '@/navigation/navigation';
import { setFCMToken, getTotalUnRead, getNotification, readOne, setStatusDeeplink } from '@/redux/notification/actions';
import { isAndroid, isIOS } from '@/shared/devices';
import { notificationWorker } from '@/shared/notification/NotificationWoker';
import {
  BID_SCREEN,
  CHAT_DETAIL_SCREEN,
  HOME_DETAIL_SCREEN,
  MY_AUCTION_DETAIL_SCREEN,
  NOTIFICATION_SCREEN,
  PROFILE_SCREEN,
  REVIEW_SCREEN,
  TABS_SCREEN,
} from '@/navigation/screenKeys';
import { getReviewRequired } from '@/redux/reviews/actions';
import { DeepLinkNotification, TypeRemindNotification } from '@/models';
import { getUser } from '@/redux/user/actions';

export default class NotificationsService {
  notificationListener!: () => any;
  notificationOpenedListener!: () => any;
  isCallZoom = false;

  setStatusZoom(status: boolean) {
    this.isCallZoom = status;
  }

  getStatusZoom() {
    return this.isCallZoom;
  }

  unRegisterNotification() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async checkPermission() {
    let fcmToken;
    try {
      fcmToken = await get(FCM_TOKEN);
    } catch (error) {}
    if (!fcmToken) {
      try {
        messaging()
          .hasPermission()
          .then(enabled => {
            if (enabled) {
              // user has permissions
              this.getToken();
            } else {
              // user doesn't have permission
              this.requestPermission();
            }
          });
      } catch (_error) {
        console.log(_error);
      }
    }
  }

  async requestPermission() {
    try {
      messaging()
        .requestPermission()
        .then(() => {
          // User has authorized
          this.getToken();
        })
        .catch(_error => {});
    } catch (error) {}
  }

  // Grant permissions to push notifications
  async getToken() {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      NavigationActionsService.dispatchAction(
        setFCMToken({
          os: isIOS ? 'ios' : 'android',
          token: fcmToken,
          onSuccess: async () => {
            await set(FCM_TOKEN, fcmToken);
          },
        }),
      );
    }
  }

  static clearBadge() {
    notificationService.unRegisterNotification();
    PushNotification.removeAllDeliveredNotifications();
    PushNotification.setApplicationIconBadgeNumber(0);
  }

  static setBadge(totalBadge: number) {
    if (isIOS) {
      PushNotification.setApplicationIconBadgeNumber(totalBadge);
    }
  }

  async createNotificationListeners() {
    // background && click push in App
    PushNotification.configure({
      onNotification: function (notification) {
        const {
          foreground,
          data: { type, entityId, id, title, messageId },
        } = notification;

        if (foreground && isIOS) {
          notificationService.handleDeepLinkInApp(type, entityId, id, title);
          PushNotification.removeDeliveredNotifications([messageId]);
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
    });

    // Press notification when quit App
    messaging()
      .getInitialNotification()
      .then((notificationOpen: any) => {
        if (notificationOpen) {
          const {
            data: { type, entityId, id },
            notification: { title },
          } = notificationOpen;

          this.handleDeepLinkQuitApp(type, entityId, id, title);
        }
      });

    // receive data in foreground
    this.notificationListener = messaging().onMessage(async remoteMessage => {
      const {
        messageId,
        data: { type, entityId, id },
        notification: { title, body },
      } = remoteMessage;
      NavigationActionsService.dispatchAction(getTotalUnRead({}));
      NavigationActionsService.dispatchAction(getNotification({ page: 1, isRefresh: true }));

      if (type === DeepLinkNotification.VERIFY_REJECTED || type === DeepLinkNotification.VERIFY_APPROVED) {
        NavigationActionsService.dispatchAction(getUser({}));
      }

      if (type === DeepLinkNotification.MEETING_ENDED && !notificationService.getStatusZoom()) {
        this.showReview();
      }

      const isRemindNotification = TypeRemindNotification.includes(type);
      const channelInfo = isRemindNotification ? 'BidBid_Remind_Sound' : 'BidBid';
      const channelSound = isRemindNotification ? 'bidbid.wav' : 'default';

      if (isAndroid) {
        PushNotification.createChannel({
          channelId: channelInfo,
          channelName: channelInfo,
          soundName: channelSound,
          importance: Importance.HIGH,
          vibrate: true,
        });
      }
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: channelInfo,
        visibility: 'private',
        messageId,

        /* iOS and Android properties */
        userInfo: {
          entityId,
          type,
          id,
          title,
          messageId,
        },
        title: title,
        message: body,
        soundName: channelSound,
      });
    });

    // Press notification on background
    this.notificationOpenedListener = messaging().onNotificationOpenedApp(async (notifications: any) => {
      const {
        messageId,
        data: { type, entityId, id },
        notification: { title },
      } = notifications;
      notificationService.handleDeepLinkInApp(type, entityId, id, title);
      isIOS && PushNotification.removeDeliveredNotifications([messageId]);
    });
  }

  showReview = () => {
    NavigationActionsService.dispatchAction(
      getReviewRequired({
        callback: {
          onSuccess: reviews => {
            if (reviews && reviews.length > 0) {
              NavigationActionsService.push(REVIEW_SCREEN);
            }
          },
          onFail: _ => {
            // TO DO
          },
        },
      }),
    );
  };

  setStatusDeepLink = () => {
    notificationWorker.setStatus(true);

    setTimeout(() => {
      notificationWorker.setStatus(false);
      // lock 3s into App from App.index
    }, TIME_LOAD_SPLASH_SCREEN + 3000);
  };

  // Quit
  handleDeepLinkQuitApp(type: string, entityId = '', idNotification = '', title = '') {
    this.setStatusDeepLink();
    switch (type) {
      case DeepLinkNotification.LIKE:
        NavigationActionsService.deepLinkTabMyAuction();
        break;
      case DeepLinkNotification.AUCTION_CREATED:
        NavigationActionsService.deepLinkTab(TABS_SCREEN, HOME_DETAIL_SCREEN, { profileId: entityId, isDeepLink: true });
        break;
      case DeepLinkNotification.RAFFLE_CREATED:
        NavigationActionsService.deepLinkTab(TABS_SCREEN, HOME_DETAIL_SCREEN, { profileId: entityId, isDeepLink: true });
        break;
      case DeepLinkNotification.AUCTION_END:
        NavigationActionsService.deepLinkTabMyAuction();
        break;
      case DeepLinkNotification.AUCTION_END_NO_WINNER:
        NavigationActionsService.deepLinkTabMyAuction();
        break;
      case DeepLinkNotification.AUCTION_CANCELED:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.RAFFLE_ENDED_FOR_CREATOR:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.RAFFLE_ENDED_FOR_WINNER:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.WON_AUCTION:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYMENT_FAILED:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.REMIND_JOIN_ZOOM:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.REMIND_SCAN_QR:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYOUT:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.MEETING_ENDED:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYMENT_FAILED_REMIND_5:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYPAL_PAYMENT_FAILED:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYMENT_FAILED_REMIND_30:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.MEETING_BIDDEE_ABSENT:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.MEETING_BIDDER_ABSENT:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.REMIND_ON_TIME:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYOUT_SENT:
        NavigationActionsService.deepLinkTabMyBid(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.LOST_HIGHEST_BID:
        NavigationActionsService.deepLinkTab(TABS_SCREEN, HOME_DETAIL_SCREEN, { profileId: entityId, isDeepLink: true });
        break;
      case DeepLinkNotification.SYSTEM:
      case DeepLinkNotification.NEWS:
      case DeepLinkNotification.UPDATES:
        NavigationActionsService.deepLinkTabNotification();
        NavigationActionsService.dispatchAction(
          readOne({
            id: entityId,
          }),
        );
        break;
      case DeepLinkNotification.NEW_MESSAGE:
        NavigationActionsService.deepLinkChat(CHAT_DETAIL_SCREEN, {
          roomId: entityId,
          name: title,
        });
        break;
      default:
        NavigationActionsService.setRoot(TABS_SCREEN);
        break;
    }
    if (idNotification) {
      NavigationActionsService.dispatchAction(
        readOne({
          id: idNotification,
        }),
      );
      NavigationActionsService.dispatchAction(getTotalUnRead({}));
    }
  }

  // Background & Foreground
  handleDeepLinkInApp(type: string, entityId = '', idNotification = '', title = '') {
    switch (type) {
      case DeepLinkNotification.LIKE:
        NavigationActionsService.push(BID_SCREEN, { isToMyAuction: true });
        break;
      case DeepLinkNotification.AUCTION_END:
        NavigationActionsService.dispatchAction(setStatusDeeplink());
        NavigationActionsService.push(BID_SCREEN, { isToMyAuction: true });
        break;
      case DeepLinkNotification.AUCTION_END_NO_WINNER:
        NavigationActionsService.dispatchAction(setStatusDeeplink());
        NavigationActionsService.push(BID_SCREEN, { isToMyAuction: true });
        break;
      case DeepLinkNotification.PAYMENT_FAILED_REMIND_5:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYOUT:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.MEETING_ENDED:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYPAL_PAYMENT_FAILED:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYMENT_FAILED_REMIND_30:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.REMIND_SCAN_QR:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.REMIND_JOIN_ZOOM:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.REMIND_ON_TIME:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.AUCTION_CANCELED:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.RAFFLE_ENDED_FOR_CREATOR:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.RAFFLE_ENDED_FOR_WINNER:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYMENT_FAILED:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.MEETING_BIDDEE_ABSENT:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.MEETING_BIDDER_ABSENT:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.AUCTION_CREATED:
        NavigationActionsService.push(HOME_DETAIL_SCREEN, { profileId: entityId, isDeepLink: true });
        break;
      case DeepLinkNotification.RAFFLE_CREATED:
        NavigationActionsService.push(HOME_DETAIL_SCREEN, { profileId: entityId, isDeepLink: true });
        break;
      case DeepLinkNotification.WON_AUCTION:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.PAYOUT_SENT:
        NavigationActionsService.push(MY_AUCTION_DETAIL_SCREEN, { item: { id: entityId } });
        break;
      case DeepLinkNotification.VERIFY_REJECTED:
        NavigationActionsService.push(PROFILE_SCREEN);
        break;
      case DeepLinkNotification.VERIFY_APPROVED:
        NavigationActionsService.push(PROFILE_SCREEN);
        break;
      case DeepLinkNotification.LOST_HIGHEST_BID:
        NavigationActionsService.push(HOME_DETAIL_SCREEN, { profileId: entityId, isDeepLink: true });
        break;
      case DeepLinkNotification.SYSTEM:
      case DeepLinkNotification.NEWS:
      case DeepLinkNotification.UPDATES:
        NavigationActionsService.push(NOTIFICATION_SCREEN);
        NavigationActionsService.dispatchAction(
          readOne({
            id: entityId,
          }),
        );
        break;
      case DeepLinkNotification.NEW_MESSAGE:
        NavigationActionsService.push(CHAT_DETAIL_SCREEN, {
          roomId: entityId,
          name: title,
        });
        break;
    }
    if (idNotification) {
      NavigationActionsService.dispatchAction(
        readOne({
          id: idNotification,
        }),
      );
      NavigationActionsService.dispatchAction(getTotalUnRead({}));
    }
  }
}

export const notificationService = new NotificationsService();
