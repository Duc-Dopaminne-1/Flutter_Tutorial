import { ActionSetIndexTutorial, ActionSetIndexTutorialPayload, TutorialActionTypes } from './index';

export function setIndexTutorial(payload: ActionSetIndexTutorialPayload): ActionSetIndexTutorial {
  return {
    type: TutorialActionTypes.SET_INDEX_TUTORIAL,
    payload,
  };
}
