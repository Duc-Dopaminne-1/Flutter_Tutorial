import { PlatForm } from '@reup/reup-api-sdk/libs/type';
import { api } from '@reup/reup-api-sdk';
import { normalize } from 'normalizr';
import { notification } from '@src/models/schemas';
import { LimitLoadMore } from '@src/constants/vars';

export const list = async (page = 1, limit = LimitLoadMore, q?: string) => {
  const response = await api.Notification.list(q, page, limit);
  return response;
};

export const getBadge = async () => {
  try {
    const result = await api.Notification.getBadge();
    return {
      data: result,
    };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};
export interface Param {
  deviceName: string;
  registrationID: string;
  deviceID: string;
  type: PlatForm;
}

export const loadNotification = async (query: any) => {
  try {
    const { results } = await api.Notification.list('', query.pageNumber, query.limit);
    const { result: data, entities } = normalize(results, [notification]);
    return {
      data,
      entities,
      canLoadMore: data.length === query.limit,
    };
  } catch (error) {
    return {
      data: [],
      entities: {},
      canLoadMore: false,
      error,
    };
  }
};

export const registerToken = async (param: Param) => {
  try {
    const result = await api.Notification.registerDevice({
      name: param.deviceName,
      registration_id: param.registrationID,
      device_id: param.deviceID,
      type: param.type,
    });
    return {
      data: result,
    };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};

export const unregisterToken = async (registrationID: string) => {
  try {
    const result = await api.Notification.unregisterDevice(registrationID);
    return {
      data: result,
    };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};

export const readNotification = async (ids: string[]) => {
  try {
    const result = await api.Notification.maskAsRead(ids);
    return {
      data: result,
    };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};

export const archiveNotification = async (ids: string[]) => {
  try {
    const result = await api.Notification.maskAsArchived(ids);
    return {
      data: result,
    };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};

export const markReadAllNotification = async () => {
  try {
    const result = await api.Notification.maskAsReadAll();
    return {
      data: result,
    };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};

export const archiveAllNotification = async () => {
  try {
    const result = await api.Notification.maskAsArchivedAll();
    return {
      data: result,
    };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};
