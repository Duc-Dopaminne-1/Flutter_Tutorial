import { ApiClient } from '@/services/http/client';
import {
  ActionGetListRoomHistoryPayload,
  ActionGetListRoomPayload,
  ActionGetMessagesPayload,
  ActionLoadMoreMessagePayload,
} from '../../redux/messages';

export class Message {
  static async getListRoom(param: ActionGetListRoomPayload): Promise<any> {
    const { isLoadMore, offset } = param;
    const url = isLoadMore ? `/rooms?offset=${offset}` : '/rooms';
    return ApiClient.get(url);
  }

  static async loadMoreMessage(param: ActionLoadMoreMessagePayload): Promise<any> {
    const { roomId, lastTimeMessage } = param;
    return ApiClient.get(`/rooms/${roomId}/messages?offset=${lastTimeMessage}`);
  }

  static async getMessages(param: ActionGetMessagesPayload): Promise<any> {
    return ApiClient.get(`/rooms/${param.roomId}/messages`);
  }

  static async getTotalUnread(): Promise<any> {
    return ApiClient.get(`/rooms/unread`);
  }

  static async getListRoomHistory(param: ActionGetListRoomHistoryPayload): Promise<any> {
    const { isLoadMore, offset } = param;
    const url = isLoadMore ? `/rooms/histories?offset=${offset}` : '/rooms/histories';
    return ApiClient.get(url);
  }
}
