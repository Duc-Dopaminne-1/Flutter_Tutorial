import { Action } from 'redux';
import reducer from './reducer';
import { CreateChannelPayload, UpdateChannelPayload } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/channel';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IChannel, IUser, IParticipant } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';

export enum ActionTypes {
  GET_CHANNEL_LIST = 'GET_CHANNEL_LIST',
  SAVE_CHANNEL_LIST = 'SAVE_CHANNEL_LIST',
  LOAD_MORE_CHANNEL_LIST = 'LOAD_MORE_CHANNEL_LIST',
  GET_CHANNEL_DETAIL = 'GET_CHANNEL_DETAIL',
  SAVE_CHANNEL_DETAIL = 'SAVE_CHANNEL_DETAIL',
  EXIST_ONE_ONE = 'EXIST_ONE_ONE',
  CREATE_CHANNEL = 'CREATE_CHANNEL',
  SAVE_CREATED_CHANNEL = 'SAVE_CREATED_CHANNEL',
  UPDATE_CHANNEL = 'UPDATE_CHANNEL',
  SAVE_UPDATED_CHANNEL = 'SAVE_UPDATED_CHANNEL',
  DELETE_CHANNEL = 'DELETE_CHANNEL',
  SAVE_DELETED_CHANNEL = 'SAVE_DELETED_CHANNEL',
  GET_FRIEND_LIST = 'GET_FRIEND_LIST',
  SAVE_FRIEND_LIST = 'SAVE_FRIEND_LIST',
  LOAD_MORE_FRIEND_LIST = 'LOAD_MORE_FRIEND_LIST',
  GET_PARTICIPANT_LIST = 'GET_PARTICIPANT_LIST',
  SAVE_PARTICIPANT_LIST = 'SAVE_PARTICIPANT_LIST',
  LOAD_MORE_PARTICIPANT_LIST = 'LOAD_MORE_PARTICIPANT_LIST',
  ADD_MEMBERS = 'ADD_MEMBERS',
  REMOVE_MEMBERS = 'REMOVE_MEMBERS',
  LEAVE_CHANNEL = 'LEAVE_CHANNEL',
  SAVE_LEFT_CHANNEL = 'SAVE_LEFT_CHANNEL',
  MARK_READ_CHANNEL = 'MARK_READ_CHANNEL',
}

export interface IChatChannelState {
  channelList: IPagination<IChannel>;
  channel?: IChannel;
  friendList: IPagination<IUser>;
  participantList: IPagination<IParticipant>;
}

// PAYLOADS
export interface IActionGetChannelListPayload extends IActionCallback {
  q?: string;
  page?: number;
  limit?: number;
}

export interface IActionSaveChannelListPayload {
  results: IPagination<IChannel>;
}

export interface IActionGetChannelDetailPayload extends IActionCallback {
  id: string;
}

export interface IActionSaveChannelDetailPayload {
  results: IChannel;
}

export interface IActionExistOneOnePayload extends IActionCallback {
  userId: string;
}

export interface IActionCreateChannelPayload extends IActionCallback {
  data: CreateChannelPayload;
}

export interface IActionSaveCreatedChannelPayload {
  results: IChannel;
}

export interface IActionUpdateChannelPayload extends IActionCallback {
  id: string;
  data: UpdateChannelPayload;
}

export interface IActionSaveUpdatedChannelPayload {
  moveToFirst?: boolean;
  results: IChannel;
}

export interface IActionDeleteChannelPayload extends IActionCallback {
  id: string;
}

export interface IActionSaveDeletedChannelPayload {
  results: IChannel;
}

export interface IActionGetFriendListPayload extends IActionCallback {
  channelId?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface IActionSaveFriendListPayload {
  results: IPagination<IUser>;
}

export interface IActionGetParticipantListPayload extends IActionCallback {
  channelId: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface IActionSaveParticipantListPayload {
  results: IPagination<IParticipant>;
}

export interface IActionAddMembersPayload extends IActionCallback {
  channelId: string;
  memberIds: Array<string>;
}

export interface IActionRemoveMembersPayload extends IActionCallback {
  channelId: string;
  memberIds: Array<string>;
}

export interface IActionLeaveChannelPayload extends IActionCallback {
  channelId: string;
}

export interface IActionSaveLeftChannelPayload {
  results: IChannel;
}

export interface IActionMarkReadChannelPayload extends IActionCallback {
  channelId: string;
}

//ACTIONS
export interface IActionGetChannelList extends Action {
  type: ActionTypes.GET_CHANNEL_LIST;
  payload: IActionGetChannelListPayload;
}

export interface IActionSaveChannelList extends Action {
  type: ActionTypes.SAVE_CHANNEL_LIST;
  payload: IActionSaveChannelListPayload;
}

export interface IActionLoadMoreChannelList extends Action {
  type: ActionTypes.LOAD_MORE_CHANNEL_LIST;
  payload: IActionSaveChannelListPayload;
}

export interface IActionGetChannelDetail extends Action {
  type: ActionTypes.GET_CHANNEL_DETAIL;
  payload: IActionGetChannelDetailPayload;
}

export interface IActionSaveChannelDetail extends Action {
  type: ActionTypes.SAVE_CHANNEL_DETAIL;
  payload: IActionSaveChannelDetailPayload;
}

export interface IActionExistOneOne extends Action {
  type: ActionTypes.EXIST_ONE_ONE;
  payload: IActionExistOneOnePayload;
}

export interface IActionCreateChannel extends Action {
  type: ActionTypes.CREATE_CHANNEL;
  payload: IActionCreateChannelPayload;
}

export interface IActionSaveCreatedChannel extends Action {
  type: ActionTypes.SAVE_CREATED_CHANNEL;
  payload: IActionSaveCreatedChannelPayload;
}

export interface IActionUpdateChannel extends Action {
  type: ActionTypes.UPDATE_CHANNEL;
  payload: IActionUpdateChannelPayload;
}

export interface IActionSaveUpdatedChannel extends Action {
  type: ActionTypes.SAVE_UPDATED_CHANNEL;
  payload: IActionSaveUpdatedChannelPayload;
}

export interface IActionDeleteChannel extends Action {
  type: ActionTypes.DELETE_CHANNEL;
  payload: IActionDeleteChannelPayload;
}

export interface IActionSaveDeletedChannel extends Action {
  type: ActionTypes.SAVE_DELETED_CHANNEL;
  payload: IActionSaveDeletedChannelPayload;
}

export interface IActionGetFriendList extends Action {
  type: ActionTypes.GET_FRIEND_LIST;
  payload: IActionGetFriendListPayload;
}

export interface IActionSaveFriendList extends Action {
  type: ActionTypes.SAVE_FRIEND_LIST;
  payload: IActionSaveFriendListPayload;
}

export interface IActionLoadMoreFriendList extends Action {
  type: ActionTypes.LOAD_MORE_FRIEND_LIST;
  payload: IActionSaveFriendListPayload;
}

export interface IActionGetParticipantList extends Action {
  type: ActionTypes.GET_PARTICIPANT_LIST;
  payload: IActionGetParticipantListPayload;
}

export interface IActionSaveParticipantList extends Action {
  type: ActionTypes.SAVE_PARTICIPANT_LIST;
  payload: IActionSaveParticipantListPayload;
}

export interface IActionLoadMoreParticipantList extends Action {
  type: ActionTypes.LOAD_MORE_PARTICIPANT_LIST;
  payload: IActionSaveParticipantListPayload;
}

export interface IActionAddMembers extends Action {
  type: ActionTypes.ADD_MEMBERS;
  payload: IActionAddMembersPayload;
}

export interface IActionRemoveMembers extends Action {
  type: ActionTypes.REMOVE_MEMBERS;
  payload: IActionRemoveMembersPayload;
}

export interface IActionLeaveChannel extends Action {
  type: ActionTypes.LEAVE_CHANNEL;
  payload: IActionLeaveChannelPayload;
}

export interface IActionSaveLeftChannel extends Action {
  type: ActionTypes.SAVE_LEFT_CHANNEL;
  payload: IActionSaveLeftChannelPayload;
}

export interface IActionMarkReadChannel extends Action {
  type: ActionTypes.MARK_READ_CHANNEL;
  payload: IActionMarkReadChannelPayload;
}

export type IActionChatChannel =
  | IActionGetChannelList
  | IActionSaveChannelList
  | IActionLoadMoreChannelList
  | IActionGetChannelDetail
  | IActionSaveChannelDetail
  | IActionExistOneOne
  | IActionCreateChannel
  | IActionSaveCreatedChannel
  | IActionUpdateChannel
  | IActionSaveUpdatedChannel
  | IActionDeleteChannel
  | IActionSaveDeletedChannel
  | IActionGetFriendList
  | IActionSaveFriendList
  | IActionLoadMoreFriendList
  | IActionGetParticipantList
  | IActionSaveParticipantList
  | IActionLoadMoreParticipantList
  | IActionAddMembers
  | IActionRemoveMembers
  | IActionLeaveChannel
  | IActionSaveLeftChannel
  | IActionResetAllState
  | IActionMarkReadChannel;

export { reducer };
