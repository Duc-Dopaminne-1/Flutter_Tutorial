import {
  ActionTypes,
  IActionGetChannelListPayload,
  IActionSaveChannelListPayload,
  IActionGetChannelDetailPayload,
  IActionSaveChannelDetailPayload,
  IActionExistOneOnePayload,
  IActionCreateChannelPayload,
  IActionUpdateChannelPayload,
  IActionSaveUpdatedChannelPayload,
  IActionDeleteChannelPayload,
  IActionGetFriendListPayload,
  IActionSaveFriendListPayload,
  IActionGetParticipantListPayload,
  IActionSaveParticipantListPayload,
  IActionAddMembersPayload,
  IActionRemoveMembersPayload,
  IActionLeaveChannelPayload,
  IActionSaveCreatedChannelPayload,
  IActionSaveDeletedChannelPayload,
  IActionSaveLeftChannelPayload,
  IActionMarkReadChannelPayload,
} from './index';

const getChannelList = (payload: IActionGetChannelListPayload) => ({
  type: ActionTypes.GET_CHANNEL_LIST,
  payload,
});

const saveChannelList = (payload: IActionSaveChannelListPayload) => ({
  type: ActionTypes.SAVE_CHANNEL_LIST,
  payload,
});

const loadMoreChannelList = (payload: IActionSaveChannelListPayload) => ({
  type: ActionTypes.LOAD_MORE_CHANNEL_LIST,
  payload,
});

const getChannelDetail = (payload: IActionGetChannelDetailPayload) => ({
  type: ActionTypes.GET_CHANNEL_DETAIL,
  payload,
});

const saveChannelDetail = (payload: IActionSaveChannelDetailPayload) => ({
  type: ActionTypes.SAVE_CHANNEL_DETAIL,
  payload,
});

const existOneOne = (payload: IActionExistOneOnePayload) => ({
  type: ActionTypes.EXIST_ONE_ONE,
  payload,
});

const createChannel = (payload: IActionCreateChannelPayload) => ({
  type: ActionTypes.CREATE_CHANNEL,
  payload,
});

const saveCreatedChannel = (payload: IActionSaveCreatedChannelPayload) => ({
  type: ActionTypes.SAVE_CREATED_CHANNEL,
  payload,
});

const updateChannel = (payload: IActionUpdateChannelPayload) => ({
  type: ActionTypes.UPDATE_CHANNEL,
  payload,
});

const saveUpdatedChannel = (payload: IActionSaveUpdatedChannelPayload) => ({
  type: ActionTypes.SAVE_UPDATED_CHANNEL,
  payload,
});

const deleteChannel = (payload: IActionDeleteChannelPayload) => ({
  type: ActionTypes.DELETE_CHANNEL,
  payload,
});

const saveDeletedChannel = (payload: IActionSaveDeletedChannelPayload) => ({
  type: ActionTypes.SAVE_DELETED_CHANNEL,
  payload,
});

const getFriendList = (payload: IActionGetFriendListPayload) => ({
  type: ActionTypes.GET_FRIEND_LIST,
  payload,
});

const saveFriendList = (payload: IActionSaveFriendListPayload) => ({
  type: ActionTypes.SAVE_FRIEND_LIST,
  payload,
});

const loadMoreFriendList = (payload: IActionSaveFriendListPayload) => ({
  type: ActionTypes.LOAD_MORE_FRIEND_LIST,
  payload,
});

const getParticipantList = (payload: IActionGetParticipantListPayload) => ({
  type: ActionTypes.GET_PARTICIPANT_LIST,
  payload,
});

const saveParticipantList = (payload: IActionSaveParticipantListPayload) => ({
  type: ActionTypes.SAVE_PARTICIPANT_LIST,
  payload,
});

const loadMoreParticipantList = (payload: IActionSaveParticipantListPayload) => ({
  type: ActionTypes.LOAD_MORE_PARTICIPANT_LIST,
  payload,
});

const addMembers = (payload: IActionAddMembersPayload) => ({
  type: ActionTypes.ADD_MEMBERS,
  payload,
});

const removeMembers = (payload: IActionRemoveMembersPayload) => ({
  type: ActionTypes.REMOVE_MEMBERS,
  payload,
});

const leaveChannel = (payload: IActionLeaveChannelPayload) => ({
  type: ActionTypes.LEAVE_CHANNEL,
  payload,
});

const saveLeftChannel = (payload: IActionSaveLeftChannelPayload) => ({
  type: ActionTypes.SAVE_LEFT_CHANNEL,
  payload,
});

const markReadChannel = (payload: IActionMarkReadChannelPayload) => ({
  type: ActionTypes.MARK_READ_CHANNEL,
  payload,
});

export {
  getChannelList,
  saveChannelList,
  loadMoreChannelList,
  getChannelDetail,
  saveChannelDetail,
  existOneOne,
  createChannel,
  saveCreatedChannel,
  updateChannel,
  saveUpdatedChannel,
  deleteChannel,
  saveDeletedChannel,
  getFriendList,
  saveFriendList,
  loadMoreFriendList,
  getParticipantList,
  saveParticipantList,
  loadMoreParticipantList,
  addMembers,
  removeMembers,
  leaveChannel,
  saveLeftChannel,
  markReadChannel,
};
