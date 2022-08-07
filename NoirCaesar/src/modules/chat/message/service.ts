import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { MessagePayload } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/message';

export const getMessageList = async (channelId: string, q?: string, page?: number, limit?: number) => {
  try {
    const response = await api.Chat.Message.list(channelId, q, page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getMessageDetail = async (id: string) => {
  try {
    const response = await api.Chat.Message.get(id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const sendMessage = async (data: MessagePayload) => {
  try {
    const response = await api.Chat.Message.send(data);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const updateMessage = async (id: string, content: string) => {
  try {
    const response = await api.Chat.Message.update(id, content);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const deleteMessage = async (id: string) => {
  try {
    const response = await api.Chat.Message.delete(id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const markRead = async (id: string) => {
  try {
    const response = await api.Chat.Message.read(id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
