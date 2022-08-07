import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { RegisterDeviceParam } from '@goldfishcode/noir-caesar-api-sdk/libs/api/notification';

export const getBadge = async () => {
  try {
    const response = await api.Notification.getBadge();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const registerToken = async (param: RegisterDeviceParam) => {
  try {
    const response = await api.Notification.registerDevice(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const unregisterToken = async (registrationID: string) => {
  try {
    const response = await api.Notification.unregisterDevice(registrationID);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getNotificationsDetail = async (notificationId: string) => {
  try {
    const response = await api.Notification.detail(notificationId);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const list = async (query?: string, page?: number, limit?: number) => {
  try {
    const response = await api.Notification.list(query, page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const maskAsRead = async (ids: string[]) => {
  try {
    const response = await api.Notification.maskAsRead(ids);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const maskAsArchived = async (ids: string[]) => {
  try {
    const response = await api.Notification.maskAsArchived(ids);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const maskAsReadAll = async () => {
  try {
    const response = await api.Notification.maskAsReadAll();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const maskAsArchivedAll = async () => {
  try {
    const response = await api.Notification.maskAsArchivedAll();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
