import {
  ActionTypes,
  IActionSaveBadgePayload,
  IActionRegisterTokenPayload,
  IActionUnregisterTokenPayload,
  IActionGetNotificationsDetailPayload,
  IActionMarkReadAllNotificationsPayload,
} from './index';
import { IActionCallback } from '@src/modules/base';

const getBadge = (payload: IActionCallback) => ({
  type: ActionTypes.GET_BADGE,
  payload,
});

const saveBadge = (payload: IActionSaveBadgePayload) => ({
  type: ActionTypes.SAVE_BADGE,
  payload,
});

const registerToken = (payload: IActionRegisterTokenPayload) => ({
  type: ActionTypes.REGISTER_TOKEN,
  payload,
});

const unregisterToken = (payload: IActionUnregisterTokenPayload) => ({
  type: ActionTypes.UNREGISTER_TOKEN,
  payload,
});

const getNotificationsDetail = (payload: IActionGetNotificationsDetailPayload) => ({
  type: ActionTypes.GET_NOTIFICATIONS_DETAIL,
  payload,
});

const markAsReadAll = (payload: IActionMarkReadAllNotificationsPayload) => ({
  type: ActionTypes.MARK_READ_ALL_NOTIFICATIONS,
  payload,
});

export { getBadge, saveBadge, registerToken, unregisterToken, getNotificationsDetail, markAsReadAll };
