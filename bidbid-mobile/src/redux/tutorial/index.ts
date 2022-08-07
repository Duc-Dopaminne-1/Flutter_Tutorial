import { Action } from 'redux';

// Action Types
export enum TutorialActionTypes {
  SET_INDEX_TUTORIAL = 'SET_INDEX_TUTORIAL',
  LOG_OUT = 'LOG_OUT',
}

export interface ActionSetIndexTutorialPayload {
  index: number;
}

export interface ActionSetIndexTutorial extends Action {
  type: TutorialActionTypes.SET_INDEX_TUTORIAL;
  payload: ActionSetIndexTutorialPayload;
}

export interface ActionLogout extends Action {
  type: TutorialActionTypes.LOG_OUT;
}

export type TutorialAction = ActionLogout | ActionSetIndexTutorial;
