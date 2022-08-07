import { ActionTypes, IAppState, IAppStateAction } from './index';

const initialState: IAppState = {
  currentState: 'active',
  root: 'login',
};

const reducer = (state: IAppState = initialState, action: IAppStateAction) => {
  switch (action.type) {
    case ActionTypes.CHANGE_APP_STATE:
      return {
        ...state,
        currentState: action.payload.appState,
      };

    default: {
      return state;
    }
  }
};

export default reducer;
