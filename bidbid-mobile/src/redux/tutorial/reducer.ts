import { TutorialAction, TutorialActionTypes } from './index';

export interface TutorialState {
  tutorial: TutorialData;
}
export interface TutorialData {
  index: number;
  data: number[];
}

const initialState: TutorialData = {
  index: 0,
  data: [1, 2, 3, 4, 5, 6, 7],
};

const reducer = (state: TutorialData = initialState, action: TutorialAction) => {
  switch (action.type) {
    case TutorialActionTypes.SET_INDEX_TUTORIAL:
      return {
        ...state,
        index: action.payload.index,
      };
    case TutorialActionTypes.LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
