import React, {useContext, useEffect} from 'react';
import {AppState} from 'react-native';
import OneSignal, {
  NotificationReceivedEvent,
  OpenedEvent,
  OSNotification,
} from 'react-native-onesignal'; // Import package from node modules

import {AppContext} from '../appData/appContext/useAppContext';
import {NAVIGATION_ANIMATION_DURATION} from '../assets/constants';
import Configs from '../configs';
import logService, {logNotification} from '../service/logService';
import useGetUnReadNotification from './Notification/useGetUnReadNotification';
import {handleUrl} from './WithDeepLinking';

const NOTIFICATION_ID_KEY = 'notificationId';

function myiOSPromptCallback(permission) {
  // do something with permission value
  logService.log('myiOSPromptCallback==permission', permission);
}

const WithOneSignal = WrappedComponent => {
  const {setLaunchUrl, getIsAppLoaded, getIsLoggedIn, receiveContactTradingB2CNotification} =
    useContext(AppContext);
  const {markUnReadNotification} = useGetUnReadNotification();
  const openUrl = url => {
    const appScheme = Configs.deepLinking.DEEP_LINKING_APP_SCHEME;
    let newUrl = url;
    if (!url) {
      // if there is no link => navigate to transaction list screen
      newUrl = `${appScheme}://notification`;
    }
    setTimeout(() => {
      handleUrl(newUrl);
    }, NAVIGATION_ANIMATION_DURATION);
  };

  const onReceived = (notificationReceivedEvent: NotificationReceivedEvent) => {
    const notification: OSNotification = notificationReceivedEvent.getNotification();
    logNotification('received', notification);

    if (getIsLoggedIn()) {
      const notificationId = notification?.additionalData?.data;
      const isContactTradingB2C = notification?.launchURL?.includes('/contact-trading-b2c');
      if (isContactTradingB2C) {
        receiveContactTradingB2CNotification({
          id: notificationId,
          message: notification?.body,
        });
      }
    }
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  };

  const onOpened = (result: OpenedEvent) => {
    logNotification('opened', result);

    const notification = result.notification;
    const isAppInFocus = AppState.currentState === 'active';
    const launchUrl = notification?.launchURL;
    let notificationId = null;
    const isNotificationIdType = notification?.additionalData?.type === NOTIFICATION_ID_KEY;

    if (isNotificationIdType) {
      notificationId = notification?.additionalData?.data;
    }

    if (isAppInFocus) {
      //app is in foreground => Deep linking will handle launch URL automatically
      if (getIsLoggedIn()) {
        openUrl(launchUrl);
        markUnReadNotification(notificationId);
      }
    } else {
      //app is in background
      if (getIsAppLoaded() && getIsLoggedIn()) {
        openUrl(launchUrl);
        markUnReadNotification(notificationId);
      } else {
        setLaunchUrl(launchUrl, notificationId);
      }
    }
  };

  useEffect(() => {
    //Remove this method to stop OneSignal Debugging
    OneSignal.setLogLevel(6, 0);
    OneSignal.setLocationShared(false);

    OneSignal.setAppId(Configs.oneSignal.ONE_SIGNAL_APP_ID);

    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

    // Method for handling received notifications before shown while in app
    OneSignal.setNotificationWillShowInForegroundHandler(onReceived);

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(onOpened);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <WrappedComponent />;
};

export default WithOneSignal;
