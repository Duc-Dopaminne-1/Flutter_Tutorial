import io, { Socket } from 'socket.io-client';
import {
  AUCTION_ACTION,
  BID_ACTION,
  CONNECT,
  CREATE_BID_ACTION,
  EXCEPTION,
  JOIN_ACTION,
  LEAVE_ACTION,
  RETRY_BID,
} from '@/shared/socket/socket-manager';
import { Auth } from '@/services';
import Config from 'react-native-config';
import { SocketWorker } from '@/shared/socket/socketWorker';
import NavigationActionsService from '@/navigation/navigation';
import { saveAuction } from '@/redux/auction/actions';
import { setAuction, setPlaceABid } from '@/redux/placeABid/actions';
import { DevENV } from '@/shared/processing';
import { AUCTION_TYPE } from '@/models';
import { getPlaceABidAuction } from '@/redux/placeABid/selector';
import { getUserId } from '@/redux/user/selector';

declare type AuctionHandler = (data: any) => void;
declare type ExceptionHandler = (data: any) => void;

interface SocketAction {
  create(token: string, userId: string): void;
  close(): void;
  isConnected(socket: typeof Socket): boolean;
  isDisconnected(socket: typeof Socket): boolean;
  listenException(callback: ExceptionHandler): void;
}

interface AuctionAction {
  joinAuction(auctionId: string, callback: AuctionHandler): void;
  leaveAuction(auctionId: string): void;
}

interface sendBidProps {
  categoryIds: number[];
  price?: number;
  auctionId: string;
  auctionType: string;
  quantity?: number;
}

interface BidAction {
  sendBid({ categoryIds, price, auctionId, quantity, auctionType }: sendBidProps): void;
}

export class BidSocket extends SocketWorker implements SocketAction, AuctionAction, BidAction {
  private socket: any;
  private token: string;
  private auctionId: string;
  private isBidNormalAfterBidMax = false;
  private isProcessingPayment = false;

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
    this.socket = io(Config.SOCKET_URL + '/bid', config);

    this.socket.connect();
    this.addEventListener(this.socket, CONNECT, _ => {});
    this.addEventListener(this.socket, AUCTION_ACTION, auction => {
      NavigationActionsService.dispatchAction(saveAuction(auction));
      NavigationActionsService.dispatchAction(setAuction(auction));
    });
  }

  getIsBidNormalAfterBidMax(): boolean {
    return this.isBidNormalAfterBidMax;
  }

  setIsBidNormalAfterBidMax(status: boolean) {
    this.isBidNormalAfterBidMax = status;
  }

  getIshHideSuccessWhenProcessingPaypal(): boolean {
    return this.isProcessingPayment;
  }

  setIshHideSuccessWhenProcessingPaypal(status: boolean) {
    this.isProcessingPayment = status;
  }

  joinAuction(auctionId: string, _: AuctionHandler) {
    if (!auctionId || auctionId.length < 1) return;
    this.emitSocket(this.socket, JOIN_ACTION, auctionId);
  }

  leaveAuction(auctionId: string) {
    if (!auctionId || auctionId.length < 1) return;
    this.emitSocket(this.socket, LEAVE_ACTION, auctionId);
  }

  sendBid({ categoryIds, price, auctionId, quantity, auctionType }: sendBidProps) {
    let bid = {};
    if (auctionType === AUCTION_TYPE.RAFFLE) {
      bid = {
        categoryIds,
        quantity,
        auctionId,
        auctionType,
      };
    } else {
      bid = {
        categoryIds,
        price,
        auctionId,
        auctionType,
      };
    }

    const placeABid = getPlaceABidAuction();
    if (placeABid.hasOwnProperty('bids')) {
      const category = placeABid?.categories?.find(item => item.id === categoryIds[0]);
      placeABid?.bids?.push({ categories: [category.name], creatorId: getUserId() });
      NavigationActionsService.dispatchAction(setPlaceABid(placeABid));
    }

    this.emitSocket(this.socket, CREATE_BID_ACTION, bid);

    this.addEventListener(this.socket, BID_ACTION, _message => {});
  }

  sendRetryBid(auctionId: string) {
    this.emitSocket(this.socket, RETRY_BID, { auctionId });
  }

  listenException(callback: ExceptionHandler) {
    this.addEventListener(this.socket, EXCEPTION, error => {
      callback && callback(error);
    });
  }
}
