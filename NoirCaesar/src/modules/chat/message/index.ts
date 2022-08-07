import { Action } from 'redux';
import reducer from './reducer';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IChannelMessage } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';
import { MessagePayload } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/message';

export enum ActionTypes {
  GET_MESSAGE_LIST = 'GET_MESSAGE_LIST',
  SAVE_MESSAGE_LIST = 'SAVE_MESSAGE_LIST',
  LOAD_MORE_MESSAGE_LIST = 'LOAD_MORE_MESSAGE_LIST',
  GET_MESSAGE_DETAIL = 'GET_MESSAGE_DETAIL',
  SAVE_MESSAGE_DETAIL = 'SAVE_MESSAGE_DETAIL',
  SEND_MESSAGE = 'SEND_MESSAGE',
  SAVE_SENT_MESSAGE = 'SAVE_SENT_MESSAGE',
  UPDATE_MESSAGE = 'UPDATE_MESSAGE',
  SAVE_UPDATED_MESSAGE = 'SAVE_UPDATED_MESSAGE',
  DELETE_MESSAGE = 'DELETE_MESSAGE',
  SAVE_DELETED_MESSAGE = 'SAVE_DELETED_MESSAGE',
  MARK_READ_MESSAGE = 'MARK_READ_MESSAGE',
  SAVE_IMAGE_SIZE = 'SAVE_IMAGE_SIZE'
}

export interface IPhotoSize {
  width: number;
  height: number;
}

export interface IPhotoState {
  [id: string]: IPhotoSize;
}

export interface IChatMessageState {
  messageList: IPagination<IChannelMessage>;
  photoSizeList: IPhotoState;
}

export interface IListChatMessageState {
  [id: string]: IChatMessageState;
}

export interface IActionPassChannelIdPayload {
  channelId: string;
}

// PAYLOADS
export interface IActionGetMessageListPayload extends IActionCallback {
  channelId: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface IActionSaveMessageListPayload extends IActionPassChannelIdPayload {
  results: IPagination<IChannelMessage>;
}

export interface IActionGetMessageDetailPayload extends IActionCallback {
  id: string;
}

export interface IActionSaveMessageDetailPayload {
  results: IChannelMessage;
}

export interface IActionSendMessagePayload extends IActionCallback {
  data: MessagePayload;
}

export interface IActionSaveSentMessagePayload extends IActionPassChannelIdPayload {
  results: IChannelMessage;
}

export interface IActionUpdateMessagePayload extends IActionCallback {
  id: string;
  content: string;
}

export interface IActionSaveUpdatedMessagePayload {
  results: IChannelMessage;
}

export interface IActionDeleteMessagePayload extends IActionCallback {
  id: string;
}

export interface IActionSaveDeletedMessagePayload {
  results: IChannelMessage;
}

export interface IActionMarkReadMessagePayload extends IActionCallback {
  id: string;
}

export interface IActionSaveImageSizePayload extends IActionPassChannelIdPayload {
  messageId: string;
  width: number;
  height: number;
}

// ACTIONS
export interface IActionGetMessageList extends Action {
  type: ActionTypes.GET_MESSAGE_LIST;
  payload: IActionGetMessageListPayload;
}

export interface IActionSaveMessageList extends Action {
  type: ActionTypes.SAVE_MESSAGE_LIST;
  payload: IActionSaveMessageListPayload;
}

export interface IActionLoadMoreMessageList extends Action {
  type: ActionTypes.LOAD_MORE_MESSAGE_LIST;
  payload: IActionSaveMessageListPayload;
}

export interface IActionGetMessageDetail extends Action {
  type: ActionTypes.GET_MESSAGE_DETAIL;
  payload: IActionGetMessageDetailPayload;
}

export interface IActionSaveMessageDetail extends Action {
  type: ActionTypes.SAVE_MESSAGE_DETAIL;
  payload: IActionSaveMessageDetailPayload;
}

export interface IActionSendMessage extends Action {
  type: ActionTypes.SEND_MESSAGE;
  payload: IActionSendMessagePayload;
}

export interface IActionSaveSentMessage extends Action {
  type: ActionTypes.SAVE_SENT_MESSAGE;
  payload: IActionSaveSentMessagePayload;
}

export interface IActionUpdateMessage extends Action {
  type: ActionTypes.UPDATE_MESSAGE;
  payload: IActionUpdateMessagePayload;
}

export interface IActionSaveUpdatedMessage extends Action {
  type: ActionTypes.SAVE_UPDATED_MESSAGE;
  payload: IActionSaveUpdatedMessagePayload;
}

export interface IActionDeleteMessage extends Action {
  type: ActionTypes.DELETE_MESSAGE;
  payload: IActionDeleteMessagePayload;
}

export interface IActionSaveDeletedMessage extends Action {
  type: ActionTypes.SAVE_DELETED_MESSAGE;
  payload: IActionSaveDeletedMessagePayload;
}

export interface IActionMarkReadMessage extends Action {
  type: ActionTypes.MARK_READ_MESSAGE;
  payload: IActionMarkReadMessagePayload;
}

export interface IActionSaveImageSize extends Action {
  type: ActionTypes.SAVE_IMAGE_SIZE;
  payload: IActionSaveImageSizePayload;
}

export type IActionChatMessage =
  | IActionGetMessageList
  | IActionSaveMessageList
  | IActionLoadMoreMessageList
  | IActionGetMessageDetail
  | IActionSaveMessageDetail
  | IActionSendMessage
  | IActionSaveSentMessage
  | IActionUpdateMessage
  | IActionSaveUpdatedMessage
  | IActionDeleteMessage
  | IActionSaveDeletedMessage
  | IActionMarkReadMessage
  | IActionSaveImageSize
  | IActionResetAllState;

export { reducer };
