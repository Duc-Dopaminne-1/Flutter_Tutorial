import { ActionTypes, INetworkStatus, INetworkStatusAction } from './index';

const initialState: INetworkStatus = {
  isConnected: false,
};

const reducer = (state: INetworkStatus = initialState, action: INetworkStatusAction) => {
  switch (action.type) {
    case ActionTypes.CHANGE_CONNECTION_STATUS:
      return {
        ...state,
        isConnected: action.payload.isConnected,
      };

    default: {
      return state;
    }
  }
};

export default reducer;
