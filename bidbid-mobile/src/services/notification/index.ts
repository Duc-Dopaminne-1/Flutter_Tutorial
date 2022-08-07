import { ApiClient } from '@/services/http/client';
import {
  ActionDeleteOnePayload,
  ActionGetNotificationPayload,
  ActionReadOnePayload,
  ActionSetFCMTokenPayload,
  ActionSetNotificationSettingPayload,
} from '../../redux/notification';

export class Notification {
  static async setFCMToken(param: ActionSetFCMTokenPayload): Promise<any> {
    return ApiClient.post('/devices', param);
  }

  static async getNotification(param: ActionGetNotificationPayload): Promise<any> {
    return ApiClient.get(`/notifications?page=${param.page}`);
  }

  static async getTotalUnRead(): Promise<any> {
    return ApiClient.get('/notifications/unread');
  }

  static async readAll(): Promise<any> {
    return ApiClient.patch('/notifications/read');
  }

  static async readOne(param: ActionReadOnePayload): Promise<any> {
    return ApiClient.patch(`/notifications/${param.id}/read`);
  }

  static async deleteOne(param: ActionDeleteOnePayload): Promise<any> {
    return ApiClient.delete(`/notifications/${param.id}`);
  }

  static async getNotificationSetting(): Promise<any> {
    return ApiClient.get('/notification-settings');
  }

  static async setNotificationSetting(param: ActionSetNotificationSettingPayload): Promise<any> {
    return ApiClient.put('/notification-settings', param);
  }

  static async deleteAllNotification(): Promise<any> {
    return ApiClient.delete('/notifications');
  }
}
