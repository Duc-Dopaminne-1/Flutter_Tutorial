import { Error, AuthAction, ActionTypes, SocialPayload } from './index';

export interface IAuthState {
  auth?: AuthData;
  error?: Error;
}

interface AuthData {
  emailToken?: string;
  phone?: string;
  social: SocialPayload;
}

const initialState: AuthData = {
  emailToken: '',
  phone: '',
  social: {
    accessToken: '',
    type: '',
  },
};

const reducer = (state: AuthData = initialState, action: AuthAction) => {
  switch (action.type) {
    case ActionTypes.SIGN_UP_PHONE:
      return {
        ...state,
        phone: action.payload.param.phoneNumber,
      };
    case ActionTypes.SAVE_TOKEN_EMAIL:
      return {
        ...state,
        emailToken: action.payload.token,
      };
    case ActionTypes.SAVE_SOCIAL:
      return {
        ...state,
        social: action.payload.social,
      };
    case ActionTypes.LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
