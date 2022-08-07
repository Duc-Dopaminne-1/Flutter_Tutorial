import { Message } from '@/services/message';
import { ActionGetListRoomHistoryPayload, ActionGetListRoomPayload, ActionGetMessagesPayload, ActionLoadMoreMessagePayload } from './index';

export const getListRoom = async (param: ActionGetListRoomPayload) => {
  try {
    const response = await Message.getListRoom(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getListRoomHistory = async (param: ActionGetListRoomHistoryPayload) => {
  try {
    const response = await Message.getListRoomHistory(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const loadMoreMessage = async (param: ActionLoadMoreMessagePayload) => {
  try {
    const response = await Message.loadMoreMessage(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getMessages = async (param: ActionGetMessagesPayload) => {
  try {
    const response = await Message.getMessages(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getTotalUnread = async () => {
  try {
    const response = await Message.getTotalUnread();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
