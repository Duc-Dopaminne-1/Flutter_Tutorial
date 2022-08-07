import { MIDDLEWARE } from '../actionsType';

const initialState = {
  state: 'hide',
  account: null
};

const banner = (state = initialState, action) => {
  switch (action.type) {
    case MIDDLEWARE.TOGGLE_SDK.STORE: {
      return {
        ...state,
        state: action.payload.state
      };
    }

    case MIDDLEWARE.SET_ACCOUNT_TOPENID.STORE: {
      return {
        ...state,
        account: action.payload
      };
    }
    case MIDDLEWARE.SET_ACCOUNT_TOPENID.CLEAR: {
      return {
        ...state,
        account: null
      };
    }
    default:
      return state;
  }
};

export default banner;
