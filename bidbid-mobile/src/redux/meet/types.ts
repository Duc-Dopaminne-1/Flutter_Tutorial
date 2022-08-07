import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';

// Action Types
export enum MeetActionTypes {
  MEET_ARRIVED = 'MEET_ARRIVED',
  MEET_CONFIRMATION = 'MEET_CONFIRMATION',
  JOIN_ROOM = 'JOIN_ROOM',
}

export interface MeetArrivedAction extends Action {
  type: MeetActionTypes.MEET_ARRIVED;
  payload: {
    auctionId: string;
    lng: number;
    lat: number;
    byPass: boolean;
    callback: ActionCallback;
  };
}

export interface MeetConfirmationAction extends Action {
  type: MeetActionTypes.MEET_CONFIRMATION;
  payload: {
    auctionId: string;
    callback: ActionCallback;
  };
}

export interface ActionJoinRoomPayload extends ActionCallback {
  startAt: string;
}

export interface ActionJoinRoom extends Action {
  type: MeetActionTypes.JOIN_ROOM;
  payload: ActionJoinRoomPayload;
}

export type MeetActions = ActionJoinRoom | MeetArrivedAction | MeetConfirmationAction;
