import {
  ActionTypes,
  IActionLogin,
  IActionLoginPayload,
  IActionLogout,
  IActionGetCurrentUser,
  IActionRefreshToken,
  IActionUpdateToken,
  IActionIsAuthenticated,
  IActionUpdateProfilePayload,
  IActionUpdateProfile,
  IActionChangePasswordPayload,
  IActionChangePassword,
  IActionSignUpPayload,
  IActionSignUp,
  IActionUploadCollectionPayload,
  IActionUploadCollection,
  IActionResetPassword,
  IActionResetPasswordPayload,
  IActionUploadVideoOrAudioPayload,
  IActionUploadVideoOrAudio,
  IActionListCollectionPayload,
  IActionListCollection,
  IActionSaveListCollectionPayload,
  IActionSaveListCollection,
  IActionSaveLoadMoreBookPayload,
  IActionSaveLoadMoreListBook,
  IActionSaveListVideo,
  IActionSaveLoadMoreVideoPayload,
  IActionSaveLoadMoreListVideo,
  IActionSaveListAudio,
  IActionSaveLoadMoreAudioPayload,
  IActionSaveLoadMoreListAudio,
  IActionSaveListPersonPayload,
  IActionGetPersonTypes,
  IActionSaveListPersonTypes,
  IActionGetAuthToken,
  IActionSaveUserPayload,
} from './index';
import { IActionCallback } from '../base';

function login(payload: IActionLoginPayload): IActionLogin {
  return {
    type: ActionTypes.LOGIN,
    payload,
  };
}

function signUp(payload: IActionSignUpPayload): IActionSignUp {
  return {
    type: ActionTypes.SIGN_UP,
    payload,
  };
}

function logout(payload: IActionCallback): IActionLogout {
  return {
    type: ActionTypes.LOG_OUT,
    payload,
  };
}

function getAuthToken(): IActionGetAuthToken {
  return {
    type: ActionTypes.GET_AUTH_TOKEN,
  };
}

function saveUser(payload: IActionSaveUserPayload) {
  return {
    type: ActionTypes.SAVE_USER,
    payload,
  };
}

function getCurrentUser(payload: IActionCallback): IActionGetCurrentUser {
  return {
    type: ActionTypes.GET_CURRENT_USER,
    payload,
  };
}

function refreshToken(payload: IActionCallback): IActionRefreshToken {
  return {
    type: ActionTypes.REFRESH_TOKEN,
    payload,
  };
}

function updateToken(): IActionUpdateToken {
  return {
    type: ActionTypes.UPDATE_TOKEN,
  };
}

function isAuthenticated(payload: IActionCallback): IActionIsAuthenticated {
  return {
    type: ActionTypes.IS_AUTHENTICATED,
    payload,
  };
}

function updateProfile(payload: IActionUpdateProfilePayload): IActionUpdateProfile {
  return {
    type: ActionTypes.UPDATE_PROFILE,
    payload,
  };
}

function changePassword(payload: IActionChangePasswordPayload): IActionChangePassword {
  return {
    type: ActionTypes.CHANGE_PASSWORD,
    payload,
  };
}

function resetPassword(payload: IActionResetPasswordPayload): IActionResetPassword {
  return {
    type: ActionTypes.RESET_PASSWORD,
    payload,
  };
}

function uploadCollection(payload: IActionUploadCollectionPayload): IActionUploadCollection {
  return {
    type: ActionTypes.UPLOAD_COLLECTION,
    payload,
  };
}

function uploadVideoOrAudio(payload: IActionUploadVideoOrAudioPayload): IActionUploadVideoOrAudio {
  return {
    type: ActionTypes.UPLOAD_VIDEO_OR_AUDIO,
    payload,
  };
}

function getListCollection(payload: IActionListCollectionPayload): IActionListCollection {
  return {
    type: ActionTypes.LIST_COLLECTION,
    payload,
  };
}

function getSaveListBook(payload: IActionSaveListCollectionPayload): IActionSaveListCollection {
  return {
    type: ActionTypes.SAVE_LIST_BOOK,
    payload,
  };
}

function getSaveLoadMoreListCollection(payload: IActionSaveLoadMoreBookPayload): IActionSaveLoadMoreListBook {
  return {
    type: ActionTypes.SAVE_LOAD_MORE_LIST_BOOK,
    payload,
  };
}

function getSaveListVideo(payload: IActionSaveListCollectionPayload): IActionSaveListVideo {
  return {
    type: ActionTypes.SAVE_LIST_VIDEO,
    payload,
  };
}

function getSaveListAudio(payload: IActionSaveListCollectionPayload): IActionSaveListAudio {
  return {
    type: ActionTypes.SAVE_LIST_AUDIO,
    payload,
  };
}

function getSaveLoadMoreListVideo(payload: IActionSaveLoadMoreVideoPayload): IActionSaveLoadMoreListVideo {
  return {
    type: ActionTypes.SAVE_LOAD_MORE_LIST_VIDEO,
    payload,
  };
}

function getSaveLoadMoreListAudio(payload: IActionSaveLoadMoreAudioPayload): IActionSaveLoadMoreListAudio {
  return {
    type: ActionTypes.SAVE_LOAD_MORE_LIST_AUDIO,
    payload,
  };
}

function getPersonTypes(payload: IActionCallback): IActionGetPersonTypes {
  return {
    type: ActionTypes.GET_PERSON_TYPES,
    payload
  };
}

function saveListPersonTypes(payload: IActionSaveListPersonPayload): IActionSaveListPersonTypes {
  return {
    type: ActionTypes.SAVE_LIST_PERSON_TYPES,
    payload
  };
}

export {
  login,
  signUp,
  logout,
  getAuthToken,
  saveUser,
  getCurrentUser,
  refreshToken,
  updateToken,
  isAuthenticated,
  updateProfile,
  changePassword,
  uploadCollection,
  resetPassword,
  uploadVideoOrAudio,
  getListCollection,
  getSaveListBook,
  getSaveLoadMoreListCollection,
  getSaveListVideo,
  getSaveLoadMoreListVideo,
  getSaveListAudio,
  getSaveLoadMoreListAudio,
  getPersonTypes,
  saveListPersonTypes
};
