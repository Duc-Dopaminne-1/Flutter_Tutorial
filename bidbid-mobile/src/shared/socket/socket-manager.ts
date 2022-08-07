import { ChatSocket } from '@/shared/socket/chat';
import { BidSocket } from '@/shared/socket/bid';
import { AuctionSocket } from '@/shared/socket/auction';

export const JOIN_ACTION = 'join';
export const JOIN_SOCKET = 'join';
export const SEND_MESSAGE = 'createMessage';
export const BID_ACTION = 'bid';
export const CREATE_BID_ACTION = 'createBid';
export const RETRY_BID = 'retryBid';
export const LEAVE_ACTION = 'leave';
export const AUCTION_ACTION = 'auction';
export const CONNECT = 'connect';
export const EXCEPTION = 'exception';
export const JOIN_MEETING = 'JOIN_MEETING';
export const CONFIRM_MEETING = 'CONFIRM_MEETING';

export class SocketManager {
  static instanceBid = new BidSocket();
  static instanceChat = new ChatSocket();
  static instanceAuction = new AuctionSocket();

  static close(): void {
    SocketManager.instanceAuction.close();
    SocketManager.instanceChat.close();
    SocketManager.instanceBid.close();
  }

  static async connect() {
    await SocketManager.instanceAuction.connect();
    await SocketManager.instanceChat.connect();
    await SocketManager.instanceBid.connect();
  }
}
