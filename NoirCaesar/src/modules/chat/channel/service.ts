import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { UpdateChannelPayload, CreateChannelPayload } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/channel';

export const getChannelList = async (q?: string, page?: number, limit?: number) => {
  try {
    const response = await api.Chat.Channel.list(q, page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getChannelDetail = async (id: string) => {
  try {
    const response = await api.Chat.Channel.get(id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const existOneOne = async (userId: string) => {
  try {
    const response = await api.Chat.Channel.existOneOne(userId);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const createChannel = async (body: CreateChannelPayload) => {
  try {
    const response = await api.Chat.Channel.create(body);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const updateChannel = async (id: string, params: UpdateChannelPayload) => {
  try {
    const response = await api.Chat.Channel.update(id, params);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const deleteChannel = async (id: string) => {
  try {
    const response = await api.Chat.Channel.delete(id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getFriendList = async (channelId?: string, q?: string, page?: number, limit?: number) => {
  try {
    const response = await api.Chat.Channel.friends(channelId, q, page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getParticipants = async (channelId: string, q?: string, page?: number, limit?: number) => {
  try {
    const response = await api.Chat.Channel.participants(channelId, q, page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const addMember = async (channelId: string, memberIds: Array<string>) => {
  try {
    const response = await api.Chat.Channel.addMembers(channelId, memberIds);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const removeMember = async (channelId: string, memberIds: Array<string>) => {
  try {
    const response = await api.Chat.Channel.removeMembers(channelId, memberIds);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const leaveChannel = async (id: string) => {
  try {
    const response = await api.Chat.Channel.leave(id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const markReadChannel = async (channelId: string) => {
  try {
    const response = await api.Chat.Channel.read(channelId);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
