import { ActionTypes, CreateProfileAction } from './index';
import _ from 'lodash';
import { CREATE_PHOTO, LANGUAGE_MODEL } from '@/models';
import { CreateProfileCity } from '@/screens/CreateAuction/component/CreateAuctionPlace';

export interface CreateProfileInit {
  createProfile: CreateProfileState;
}

interface CreateProfileState {
  email: string;
  firstName: string;
  lastName: string;
  instagramUsername: string;
  dateOfBirth: string;
  hideAge: boolean;
  genderId: string;
  photos: CREATE_PHOTO[];
  career: number[];
  categories?: number[];
  avatar: CREATE_PHOTO;
  languages?: LANGUAGE_MODEL[];
  providerId?: string;
  city?: CreateProfileCity;
  isSkipPhoneNumber?: boolean;
}

const initialState: CreateProfileState = {
  email: '',
  firstName: '',
  lastName: '',
  instagramUsername: '',
  hideAge: false,
  dateOfBirth: '',
  genderId: '',
  photos: [],
  languages: [],
  career: [],
  providerId: '',
  avatar: {
    type: '',
    uri: '',
    name: '',
  },
  city: {
    address: '',
    lat: 0,
    lng: 0,
    name: '',
    city: '',
    country: '',
  },
  isSkipPhoneNumber: false,
};

const reducer = (state: CreateProfileState = initialState, action: CreateProfileAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_PROFILE:
      return _.merge({}, state, action.payload);
    case ActionTypes.UPDATE_LANGUAGE:
      return {
        ...state,
        languages: action.payload.languages,
      };
    case ActionTypes.LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
