import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IComment } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment/models';
import { ActionTypes, IActionComments } from './index';
import { CommonActionType } from '../base';

const initialState: IPagination<IComment> = {
  count: 0,
  next: '',
  previous: '',
  results: [],
};

const reducer = (state: IPagination<IComment> = initialState, action: IActionComments) => {
  switch (action.type) {
    case ActionTypes.SAVE_LIST_COMMENT:
      return {
        ...state,
        ...action.payload.results,
      };
    case ActionTypes.LOAD_MORE_LIST_COMMENT:
      return {
        ...state,
        results: [...state.results, ...action.payload.results.results],
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
