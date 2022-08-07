import { ApiClient, SocketIO, api } from '@goldfishcode/noir-caesar-api-sdk';
import { IChannel, IParticipant, ChannelType, ChannelUserStatus, ISocketChannel, ISocketMessage } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';
import { MESSAGE } from '@src/constants/screenKeys';
import * as ChannelActions from '@src/modules/chat/channel/actions';
import * as MessageActions from '@src/modules/chat/message/actions';
import NotificationsService from '@src/modules/notifications/service';
import NavigationActionsService from '@src/navigation/navigation';
import store from '@src/redux/store';
import { get } from 'lodash';
import { AppStateStatus } from 'react-native';

export class SocketService {
  private static _instance: SocketService;
  private callbackMemberRemoved?: () => void;

  private constructor() { }

  static getInstance(): SocketService {
    if (!SocketService._instance) {
      SocketService._instance = new SocketService();
    }
    return SocketService._instance;
  }

  async initConnection() {
    const isConnected = SocketIO.instance().isConnected();
    if (!isConnected) {
      await this.connectSocket();
    }
    this.registerEventListener();
  }

  registerCallbackMemberRemoved(callback: () => void) {
    this.callbackMemberRemoved = callback;
  }

  unregisterCallBackMemberRemoved() {
    this.callbackMemberRemoved = undefined;
  }

  onAppStateChange(nextAppState: AppStateStatus) {
    if (nextAppState === 'active') this.initConnection();
    else this.closeSocket();
  }

  registerEventListener() {
    this.registerChannelListener();
    this.registerMessageListener();
    this.registerSocketStateListener();
  }

  async connectSocket() {
    try {
      const config = ApiClient.getApiConfig();
      const socket = SocketIO.instance();
      const token = await ApiClient.getAuthToken();
      const { socketUrl } = config;
      if (socketUrl && token && token.access_token) {
        socket.connect(socketUrl, token.access_token);
      }
    } catch (error) {
      console.log('SocketService.connectSocket(): error=', error);
    }
  }

  closeSocket() {
    const isConnected = SocketIO.instance().isConnected();
    if (isConnected) {
      SocketIO.instance().close();
    }
  }

  registerSocketStateListener() {
    const listener = api.Chat.SocketListener.instance();

    listener.addEventListener('connect', () => console.log('SocketService: connect!'));
    listener.addEventListener('disconnect', () => console.log('SocketService: disconnect!'));
    listener.addEventListener('error', () => console.log('SocketService: error!'));
  }

  handleLeftRemoveChannel(socketChannel: ISocketChannel, status: ChannelUserStatus) {
    const { channel, messages, participants } = socketChannel;
    const me = store.getState().auth.userData;
    const isLeft = participants.filter((participant: IParticipant) => {
      const isSelfUser = participant.user && participant.user.user_id === me.user_id;
      return participant.status === status && isSelfUser;
    }).length > 0;

    if (isLeft) {
      store.dispatch(ChannelActions.saveLeftChannel({ results: socketChannel.channel }));
    }
    else {
      const newChannel: IChannel = {
        ...channel,
        badge: 1,
        last_message_time: messages[0].modified,
        last_message: { ...messages[0] },
      }
      store.dispatch(ChannelActions.saveUpdatedChannel({ results: newChannel }));
      store.dispatch(MessageActions.saveSentMessage({ channelId: channel.id, results: messages[0] }));
    }
  }

  registerChannelListener() {
    const listener = api.Chat.SocketListener.instance();

    listener.onChannelCreated((socketChannel: ISocketChannel) => {
      store.dispatch(ChannelActions.saveCreatedChannel({ results: socketChannel.channel }));
    });

    listener.onChannelLeft((socketChannel: ISocketChannel) => {
      this.handleLeftRemoveChannel(socketChannel, ChannelUserStatus.LEFT);
    });

    listener.onChannelUpdated((socketChannel: IChannel) => {
      store.dispatch(ChannelActions.saveUpdatedChannel({ results: socketChannel }));
    });

    // listener.onChannelDeleted((channel: IChannel) => {
    //   store.dispatch(ChannelActions.saveDeletedChannel({ results: channel }));
    // });

    listener.onChannelMemberAdded((socketChannel: ISocketChannel) => {
      const { channel, messages, participants } = socketChannel;
      const newChannel: IChannel = {
        ...channel,
        badge: 1,
        last_message_time: messages[0].modified,
        last_message: { ...messages[0] },
      }
      store.dispatch(ChannelActions.saveUpdatedChannel({ results: newChannel }));
      store.dispatch(MessageActions.saveSentMessage({ channelId: channel.id, results: messages[0] }));
    });

    listener.onChannelMemberRemoved((socketChannel: ISocketChannel) => {
      this.handleLeftRemoveChannel(socketChannel, ChannelUserStatus.REMOVED);
      const id = get(socketChannel, ["channel", "id"], "");
      if (id && NavigationActionsService.screenName == MESSAGE && id === NotificationsService.getInstance().currentChannelId) {
        const { participants } = socketChannel;
        const me = store.getState().auth.userData;
        const isRemoved = participants.filter((part: IParticipant) => {
          return part.user && part.user.user_id === me.user_id;
        }).length > 0;
        if (isRemoved) {
          this.callbackMemberRemoved && this.callbackMemberRemoved();
        }
      }
    });
  }

  registerMessageListener() {
    const listener = api.Chat.SocketListener.instance();

    listener.onMessage((socketMessage: ISocketMessage) => {
      const { channel, message } = socketMessage;
      const me = store.getState().auth.userData;
      const selfSender = me.user_id === message.sender.user_id;
      let newChannel: IChannel;

      if (channel.type === ChannelType.ONE_ONE) {
        if (selfSender) {
          newChannel = {
            ...channel,
            badge: 0,
            last_message_time: message.modified,
            last_message: { ...message },
          };
        } else {
          newChannel = {
            ...channel,
            avatar: message.sender.avatar,
            display_name: message.sender.display_name,
            badge: 1,
            last_message_time: message.modified,
            last_message: { ...message },
          };
        }
      }
      else {
        newChannel = {
          ...channel,
          badge: selfSender ? 0 : 1,
          last_message_time: message.modified,
          last_message: { ...message },
        }
      }

      store.dispatch(ChannelActions.saveUpdatedChannel({ results: newChannel }));
      store.dispatch(MessageActions.saveSentMessage({ channelId: channel.id, results: message }));
    });

    // listener.onMessageUpdated((message: IChannelMessage) => {
    //   store.dispatch(MessageActions.saveUpdatedMessage({ results: message }));
    // });

    // listener.onMessageDeleted((message: IChannelMessage) => {
    //   store.dispatch(
    //     MessageActions.saveDeletedMessage({ results: message }),
    //   );
    // });
  }
}
