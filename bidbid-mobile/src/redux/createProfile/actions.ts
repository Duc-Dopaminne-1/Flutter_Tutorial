import { ActionTypes, ActionCreateProfile, ActionSaveProfile, ActionSaveProfilePayload, ActionUpdateLanguage } from './index';

function saveProfile(payload: ActionSaveProfilePayload): ActionSaveProfile {
  return {
    type: ActionTypes.SAVE_PROFILE,
    payload,
  };
}

function updateLanguage(payload: ActionSaveProfilePayload): ActionUpdateLanguage {
  return {
    type: ActionTypes.UPDATE_LANGUAGE,
    payload,
  };
}

function createProfile(payload: ActionSaveProfilePayload): ActionCreateProfile {
  return {
    type: ActionTypes.CREATE_PROFILE,
    payload,
  };
}

export { saveProfile, createProfile, updateLanguage };
