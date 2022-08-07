import io, { Socket } from 'socket.io-client';
import Config from 'react-native-config';
import { CONNECT, SEND_MESSAGE } from '@/shared/socket/socket-manager';
import { Auth } from '@/services';
import { SocketWorker } from '@/shared/socket/socketWorker';
import NavigationActionsService from '@/navigation/navigation';
import {
  getListRoom,
  getTotalUnread,
  saveBackupMessages,
  saveMessages,
  updateListRoom,
  updateRoomReadMessage,
} from '@/redux/messages/actions';
import store from '@/redux/store';
import { DevENV } from '@/shared/processing';
import { formatNameUser } from '@/shared/discovery';

export class ChatSocket extends SocketWorker {
  private socket: Socket;
  private token: string;

  async connect() {
    const result = await Auth.getAuthToken();
    const accessToken = result?.access_token;
    if (!this.isConnected(this.socket)) {
      this.create(accessToken);
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  create(token: string) {
    if (!token || token.length < 1) return;
    this.token = token;
    const config = DevENV()
      ? {
          query: { token },
        }
      : {
          transports: ['websocket'],
          query: { token },
        };
    this.socket = io(Config.SOCKET_URL + '/chat', config);

    this.socket.connect();
    this.addEventListener(this.socket, CONNECT, () => {});
    this.addEventListener(this.socket, 'message', this.listenMessage);
  }

  listenMessage = ({ message, room }) => {
    const { rooms } = store.getState().message;
    if (rooms.length === 0) {
      return;
    } else if (!message) {
      NavigationActionsService.dispatchAction(getTotalUnread());
      if (!room.hiddenBy) {
        NavigationActionsService.dispatchAction(updateRoomReadMessage({ roomId: room.id }));
        return;
      }
      // delete room
      NavigationActionsService.dispatchAction(getListRoom({}));
      return;
    }
    const { id, content, createdAt, creator } = message;
    const data = [
      {
        _id: id,
        text: content,
        createdAt: createdAt,
        user: {
          _id: creator?.id,
          name: formatNameUser(creator),
          avatar: room.imageUrl,
        },
      },
    ];
    NavigationActionsService.dispatchAction(getTotalUnread());
    NavigationActionsService.dispatchAction(updateListRoom({ data: [room] }));
    NavigationActionsService.dispatchAction(saveMessages({ data, roomId: room.id }));
    NavigationActionsService.dispatchAction(saveBackupMessages({ data, roomId: room.id }));
  };

  sendMessage(roomId: string, content: string) {
    const message = {
      content,
      roomId,
    };
    this.emitSocket(this.socket, SEND_MESSAGE, message);
  }

  readMessage(roomId: string) {
    this.emitSocket(this.socket, 'readMessages', { roomId });
  }

  deleteRoom(roomId: string) {
    this.emitSocket(this.socket, 'hideRoom', { roomId });
  }
}
