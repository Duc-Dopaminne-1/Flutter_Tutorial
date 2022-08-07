import { ActionTypes, IAuthAction, CommonActionType } from './index';
import moment from 'moment';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';

export interface IAuthState {
  tryAuthDone: boolean;
  logging: boolean;
  userData?: IUserProfile;
  isTokenRefreshing: boolean;
  lastTimeTokenRefreshed?: Date;
}

const initialState: IAuthState = {
  tryAuthDone: false,
  logging: false,
  isTokenRefreshing: false,
  userData: {
    user_id: '',
    email: '',
    first_name: '',
    last_name: '',
    avatar: '',
    phone_code: '',
    phone: '',
    phone1_code: '',
    phone1: '',
    gender: '',
    date_of_birth: '',
    identity_code: '',
    identity_type: '',
    address: '',
    is_updated_profile: false,
    default_company: {
      id: '',
      name: ''
    },
    default_property: ''
  }
};

const reducer = (state: IAuthState = initialState, action: IAuthAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_USER:
      return {
        ...state,
        logging: true,
        logged: true,
        lastTimeTokenRefreshed: state.lastTimeTokenRefreshed || moment().toDate(),
        userData: action.payload,
      };
    case ActionTypes.REFRESH_TOKEN:
      return {
        ...state,
        isTokenRefreshing: true,
      };
    case ActionTypes.UPDATE_TOKEN:
      return {
        ...state,
        isTokenRefreshing: false,
        lastTimeTokenRefreshed: moment().toDate(),
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
