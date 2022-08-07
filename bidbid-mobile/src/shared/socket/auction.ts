import io from 'socket.io-client';
import { CONFIRM_MEETING, CONNECT, JOIN_MEETING } from '@/shared/socket/socket-manager';
import { Auth } from '@/services';
import { SocketWorker } from '@/shared/socket/socketWorker';
import NavigationActionsService from '@/navigation/navigation';
import { joinRoom } from '@/redux/meet/actions';
import { COUNT_DOWN_SCREEN } from '@/navigation/screenKeys';
import { DevENV } from '@/shared/processing';
import Config from 'react-native-config';

export class AuctionSocket extends SocketWorker {
  private socket: any;
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
    this.socket = io(Config.SOCKET_URL + '/auction', config);

    this.socket.connect();
    this.addEventListener(this.socket, CONNECT, () => {});
    this.addEventListener(this.socket, JOIN_MEETING, this.listenRoom);
    this.addEventListener(this.socket, CONFIRM_MEETING, this.listenMeetAndGreetStart);
  }

  // { userId, auctionId, confirmedAt }
  listenRoom = ({ confirmedAt }) => {
    NavigationActionsService.dispatchAction(
      joinRoom({
        startAt: confirmedAt,
      }),
    );
  };

  listenMeetAndGreetStart = ({ auctionId }) => {
    NavigationActionsService.push(COUNT_DOWN_SCREEN, {
      auction: {
        id: auctionId,
      },
    });
  };
}
