import {
  ActionTypes,
  IActionGetProfilePayload,
  IActionSaveProfilePayload,
  IActionListRetrieveCollectionPayload,
  IActionSaveListContentPayload,
  IActionSaveLoadMoreAudioPayload,
  IActionSaveLoadMoreBookPayload,
  IActionSaveLoadMoreVideoPayload,
  IActionFollowPayload,
  IActionUnfollowPayload
} from './index';

const getProfileDetail = (payload: IActionGetProfilePayload) => ({
  type: ActionTypes.GET_PROFILE_DETAIL,
  payload,
});

const saveProfileDetail = (payload: IActionSaveProfilePayload) => ({
  type: ActionTypes.SAVE_PROFILE_DETAIL,
  payload,
});

const getListRetrieveCollection = (payload: IActionListRetrieveCollectionPayload) => ({
  type: ActionTypes.LIST_RETRIEVE_COLLECTION,
  payload,
});

const saveListBook = (payload: IActionSaveListContentPayload) => ({
  type: ActionTypes.SAVE_USER_LIST_BOOK,
  payload,
});

const saveListVideo = (payload: IActionSaveListContentPayload) => ({
  type: ActionTypes.SAVE_USER_LIST_VIDEO,
  payload,
});

const saveListAudio = (payload: IActionSaveListContentPayload) => ({
  type: ActionTypes.SAVE_USER_LIST_AUDIO,
  payload,
});

const saveLoadMoreListBook = (payload: IActionSaveLoadMoreBookPayload) => ({
  type: ActionTypes.SAVE_LOAD_MORE_USER_LIST_BOOK,
  payload,
});

const saveLoadMoreListVideo = (payload: IActionSaveLoadMoreVideoPayload) => ({
  type: ActionTypes.SAVE_LOAD_MORE_USER_LIST_VIDEO,
  payload,
});

const saveLoadMoreListAudio = (payload: IActionSaveLoadMoreAudioPayload) => ({
  type: ActionTypes.SAVE_LOAD_MORE_USER_LIST_AUDIO,
  payload,
});

const follow = (payload: IActionFollowPayload) => ({
  type: ActionTypes.FOLLOW,
  payload
})

const unfollow = (payload: IActionUnfollowPayload) => ({
  type: ActionTypes.UNFOLLOW,
  payload
})

export {
  getProfileDetail,
  saveProfileDetail,
  getListRetrieveCollection,
  saveListBook,
  saveListVideo,
  saveListAudio,
  saveLoadMoreListBook,
  saveLoadMoreListVideo,
  saveLoadMoreListAudio,
  follow,
  unfollow
};
