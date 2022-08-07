/* eslint-disable @typescript-eslint/ban-types */
import { MeetActions, MeetActionTypes } from './types';

export interface MeetAndGreetInit {
  meet: MeetAndGreetData;
}
export interface MeetAndGreetData {
  data: {};
  startAt: string;
}
const initialState: MeetAndGreetData = {
  data: {},
  startAt: '',
};

const reducer = (state: MeetAndGreetData = initialState, action: MeetActions): MeetAndGreetData => {
  switch (action.type) {
    case MeetActionTypes.JOIN_ROOM:
      return {
        ...state,
        startAt: action.payload.startAt,
      };
    default:
      return state;
  }
};

export default reducer;
