import {
  ActionDeleteOnePayload,
  ActionGetNotificationPayload,
  ActionReadOnePayload,
  ActionSetFCMTokenPayload,
  ActionSetNotificationSettingPayload,
} from './index';
import { Notification } from '@/services/notification';

export const setFCMToken = async (param: ActionSetFCMTokenPayload) => {
  try {
    const response = await Notification.setFCMToken(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getNotification = async (param: ActionGetNotificationPayload) => {
  try {
    const response = await Notification.getNotification(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getTotalUnRead = async () => {
  try {
    const response = await Notification.getTotalUnRead();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const readAll = async () => {
  try {
    const response = await Notification.readAll();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const readOne = async (param: ActionReadOnePayload) => {
  try {
    const response = await Notification.readOne(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const deleteOne = async (param: ActionDeleteOnePayload) => {
  try {
    const response = await Notification.deleteOne(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getNotificationSetting = async () => {
  try {
    const response = await Notification.getNotificationSetting();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const setNotificationSetting = async (param: ActionSetNotificationSettingPayload) => {
  try {
    const response = await Notification.setNotificationSetting(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const deleteAllNotification = async () => {
  try {
    const response = await Notification.deleteAllNotification();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
