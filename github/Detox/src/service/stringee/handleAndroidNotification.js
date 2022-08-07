import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {NativeModules} from 'react-native';

import {translate} from '../../assets/localize';
import {MESSAGE_TYPE} from '../../screens/Chat/types';
import {logStringee} from '../logService';

export const handleAndroidNotification = () => {
  messaging().setBackgroundMessageHandler(onReceivedMessage);
};

const onReceivedMessage = async remoteMessage => {
  const isChatMessage = remoteMessage.data.type === 'CHAT_EVENT';
  const data = JSON.parse(remoteMessage.data.data);
  const callStatus = data.callStatus;
  const from = data.from?.number;
  const messageContent = data?.message?.content;
  logStringee('setBackgroundMessageHandler', remoteMessage);
  // console.log({callStatus, from});

  const appName = 'TopenLand';
  const notificationId = 'NOTIFICATION_ID';
  const channelId = await notifee.createChannel({
    id: 'CHANNEL_ID',
    name: 'ChannelName',
    vibration: true,
  });

  if (isChatMessage) {
    const getBodyMessage = () => {
      switch (data?.type) {
        case MESSAGE_TYPE.PHOTO:
          return translate('chat.notification.photo');
        case MESSAGE_TYPE.FILE:
          return translate('chat.notification.file');
        case MESSAGE_TYPE.CONVERSATION_CREATION_NOTIFICATION:
          const contactId = data?.convName;
          return translate('chat.notification.groupCreated', {id: contactId});
        default:
          return messageContent;
      }
    };
    notifee.displayNotification({
      id: notificationId,
      title: data?.displayName,
      body: getBodyMessage(),
      android: {
        channelId,
        pressAction: {
          id: 'default',
          mainComponent: appName,
        },
      },
    });
    return;
  }

  switch (callStatus) {
    case 'started':
      const {Launcher} = NativeModules;
      Launcher.backToForeground();

      await notifee.displayNotification({
        id: notificationId,
        title: from,
        body: translate('call.notification.callStarted'),
        android: {
          channelId,
          pressAction: {
            id: 'default',
            mainComponent: appName,
          },
        },
      });
      break;
    case 'ended':
      await notifee.cancelNotification(notificationId);
      break;
  }
};
