import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';
import { MessageChat } from '@/models/message';

// Action Types
export enum ActionTypes {
  LOG_OUT = 'LOG_OUT',
  GET_LIST_ROOM = 'GET_LIST_ROOM',
  GET_LIST_ROOM_HISTORY = 'GET_LIST_ROOM_HISTORY',
  UPDATE_LIST_ROOM = 'UPDATE_LIST_ROOM',
  SAVE_LIST_ROOM = 'SAVE_LIST_ROOM',
  SAVE_LIST_ROOM_HISTORY = 'SAVE_LIST_ROOM_HISTORY',
  UPDATE_ROOM_READ_MESSAGE = 'UPDATE_ROOM_READ_MESSAGE',
  GET_MESSAGES = 'GET_MESSAGES',
  SAVE_MESSAGES = 'SAVE_MESSAGES',
  SAVE_BACKUP_MESSAGES = 'SAVE_BACKUP_MESSAGES',
  SAVE_MESSAGES_ON_TOP = 'SAVE_MESSAGES_ON_TOP',
  LOAD_MORE_MESSAGE = 'LOAD_MORE_MESSAGE',
  GET_TOTAL_UNREAD_MESSAGE = 'GET_TOTAL_UNREAD_MESSAGE',
  SAVE_TOTAL_UNREAD_MESSAGE = 'SAVE_TOTAL_UNREAD_MESSAGE',
  INIT_MESSAGES = 'INIT_MESSAGES',
}

export interface ActionGetMessagesPayload extends ActionCallback {
  roomId: string;
}

export interface ActionGetMessagesPayload {
  roomId: string;
}

export interface ActionSaveBackupMessagesPayload extends ActionCallback {
  data: MessageChat[];
  roomId?: string;
}

export interface ActionSaveBackupMessages extends Action {
  type: ActionTypes.SAVE_BACKUP_MESSAGES;
  payload: ActionSaveBackupMessagesPayload;
}

export interface ActionSaveMessagesPayload extends ActionCallback {
  data: MessageChat[];
  roomId?: string;
}

export interface ActionInitMessagesPayload extends ActionCallback {
  data: MessageChat[];
  roomId?: string;
}

export interface ActionSaveMessagesOnTopPayload extends ActionCallback {
  data: MessageChat[];
  roomId?: string;
}

export interface ActionLoadMoreMessagePayload extends ActionCallback {
  lastTimeMessage: string;
  roomId?: string;
}

export interface ActionSaveMessages extends Action {
  type: ActionTypes.SAVE_MESSAGES;
  payload: ActionSaveMessagesPayload;
}

export interface ActionInitMessages extends Action {
  type: ActionTypes.INIT_MESSAGES;
  payload: ActionInitMessagesPayload;
}

export interface ActionSaveMessagesOnTop extends Action {
  type: ActionTypes.SAVE_MESSAGES_ON_TOP;
  payload: ActionSaveMessagesOnTopPayload;
}

export interface ActionGetMessages extends Action {
  type: ActionTypes.GET_MESSAGES;
  payload: ActionGetMessagesPayload;
}

export interface ActionGetListRoomPayload extends ActionCallback {
  isLoadMore?: boolean;
  offset?: string;
}

export interface ActionGetListRoom extends Action {
  type: ActionTypes.GET_LIST_ROOM;
  payload: ActionGetListRoomPayload;
}

export interface ActionGetListRoomHistoryPayload extends ActionCallback {
  isLoadMore?: boolean;
  offset?: string;
}

export interface ActionGetListRoomHistory extends Action {
  type: ActionTypes.GET_LIST_ROOM_HISTORY;
  payload: ActionGetListRoomHistoryPayload;
}

export interface ActionUpdateListRoom extends Action {
  type: ActionTypes.UPDATE_LIST_ROOM;
  payload: ActionUpdateListRoomPayload;
}

export interface ActionSaveListRoomPayload extends ActionCallback {
  data: any[];
  isLoadMore?: boolean;
}

export interface ActionSaveListRoomHistoryPayload extends ActionCallback {
  data: any[];
  isLoadMore?: boolean;
}

export interface ActionUpdateListRoomPayload extends ActionCallback {
  data: any[];
}

export interface ActionSaveListRoom extends Action {
  type: ActionTypes.SAVE_LIST_ROOM;
  payload: ActionSaveListRoomPayload;
}

export interface ActionSaveListRoomHistory extends Action {
  type: ActionTypes.SAVE_LIST_ROOM_HISTORY;
  payload: ActionSaveListRoomHistoryPayload;
}

export interface ActionLoadMoreMessage extends Action {
  type: ActionTypes.LOAD_MORE_MESSAGE;
  payload: ActionLoadMoreMessagePayload;
}

export interface ActionGetTotalUnread extends Action {
  type: ActionTypes.GET_TOTAL_UNREAD_MESSAGE;
}

export interface ActionSaveTotalUnreadPayload extends ActionCallback {
  total: number;
}

export interface ActionSaveTotalUnread extends Action {
  type: ActionTypes.SAVE_TOTAL_UNREAD_MESSAGE;
  payload: ActionSaveTotalUnreadPayload;
}

export interface ActionUpdateRoomMessagePayload extends ActionCallback {
  roomId: number;
}

export interface ActionUpdateRoomMessage extends Action {
  type: ActionTypes.UPDATE_ROOM_READ_MESSAGE;
  payload: ActionUpdateRoomMessagePayload;
}

export interface ActionLogout extends Action {
  type: ActionTypes.LOG_OUT;
}

export type MessagesAction =
  | ActionGetListRoom
  | ActionSaveTotalUnread
  | ActionLoadMoreMessage
  | ActionSaveListRoom
  | ActionSaveBackupMessages
  | ActionSaveListRoomHistory
  | ActionUpdateListRoom
  | ActionUpdateRoomMessage
  | ActionLogout
  | ActionSaveMessages
  | ActionSaveMessagesOnTop
  | ActionInitMessages
  | ActionGetMessages;
