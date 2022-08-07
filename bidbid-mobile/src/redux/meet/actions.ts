import { MeetActionTypes, MeetActions, ActionJoinRoomPayload } from './types';
import { ActionCallback } from '@/redux/auth';

export const meetArrived = (payload: {
  auctionId: string;
  lng: number;
  lat: number;
  byPass: boolean;
  callback: ActionCallback;
}): MeetActions => ({
  type: MeetActionTypes.MEET_ARRIVED,
  payload,
});

export const meetConfirmation = (payload: { auctionId: string; callback: ActionCallback }): MeetActions => ({
  type: MeetActionTypes.MEET_CONFIRMATION,
  payload,
});

export const joinRoom = (payload: ActionJoinRoomPayload) => ({
  type: MeetActionTypes.JOIN_ROOM,
  payload,
});
