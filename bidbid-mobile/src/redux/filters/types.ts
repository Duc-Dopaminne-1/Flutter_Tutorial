import { Action } from 'redux';
import { ActionCallback, ActionLogout } from '@/redux/auth';
import { City } from '@/models';
import { FilterData, FiltersGeneralData } from './reducer';
import { language } from '@/i18n';
import { ActionSearchNearPlacePayload, ActionTypes } from '@/redux/auction';
import { FindProfiles } from '@/models/findProfiles';
import { MeetActionTypes } from '@/redux/meet/types';

export enum AuctionStatusParams {
  BIDDING = 'bidding',
  MEET_TIME = 'meetTime',
  END_TIME = 'endTime',
}

export enum FilterAuctionStatusEnum {
  ALL = 'all',
  BIDDING = 'bidding',
  END_TIME = 'end_time',
  MEET_TIME = 'meet_time',
}
export enum FilterCategoriesEnum {
  CAREER = 'Career',
  SOCIAL = 'Social',
  DATING = 'Dating',
}

export enum AuctionStatusEnum {
  ALL = 'All',
  SHOW_ONLY_LIVE_AUCTIONS = 'Show only Live Auctions',
  AUCTIONS_ENDING_SOONEST = 'Auctions ending soonest',
  MEET_AND_GREET_SOONEST = 'Meet & Greet soonest',
}

export const AuctionStatusDumpData = [
  {
    id: 1100,
    name: FilterAuctionStatusEnum.ALL,
    description: language('allProfiles'),
  },
  {
    id: 1200,
    name: FilterAuctionStatusEnum.BIDDING,
    description: language('showOnlyLiveAuctions'),
  },
  {
    id: 1300,
    name: FilterAuctionStatusEnum.END_TIME,
    description: language('auctionsSoonest'),
  },
  {
    id: 1400,
    name: FilterAuctionStatusEnum.MEET_TIME,
    description: language('meetSoonest'),
  },
];

export const CategoriesDumpData = [
  {
    id: 1100,
    name: FilterCategoriesEnum.CAREER,
    description: language('allProfiles'),
  },
  {
    id: 1200,
    name: FilterCategoriesEnum.SOCIAL,
    description: language('showOnlyLiveAuctions'),
  },
  {
    id: 1300,
    name: FilterCategoriesEnum.DATING,
    description: language('auctionsSoonest'),
  },
];

// Action Types
export enum FiltersActionTypes {
  FILTER_GET_GENERAL = 'FILTER_GET_GENERAL',
  FILTER_SET_GENERAL = 'FILTER_SET_GENERAL',
  FILTER_SAVE_GENERAL = 'FILTER_SAVE_GENERAL',

  FILTER_SAVE_FIND_PROFILES = 'FILTER_SAVE_FIND_PROFILES',

  FILTER_GET_GENDERS = 'FILTER_GET_GENDERS',
  FILTER_SET_GENDER = 'FILTER_SET_GENDER',
  FILTER_DELETE_GENDER = 'FILTER_DELETE_GENDER',

  FILTER_GET_SEXUAL_ORIENTATION = 'FILTER_GET_SEXUAL_ORIENTATION',
  FILTER_SET_SEXUAL_ORIENTATION = 'FILTER_SET_SEXUAL_ORIENTATION',

  FILTER_GET_CATEGORIES = 'FILTER_GET_CATEGORIES',
  FILTER_SET_CATEGORIES = 'FILTER_SET_CATEGORIES',
  FILTER_SET_CAREER_STRENGTHS = 'FILTER_SET_CAREER_STRENGTHS',

  FILTER_GET_LANGUAGES = 'FILTER_GET_LANGUAGES',
  FILTER_SET_LANGUAGES = 'FILTER_SET_LANGUAGES',

  FILTER_GET_AUCTION_STATUS = 'FILTER_GET_AUCTION_STATUS',
  FILTER_SET_AUCTION_STATUS = 'FILTER_SET_AUCTION_STATUS',
  FILTER_SAVE_AUCTION_STATUS = 'FILTER_SAVE_AUCTION_STATUS',

  FILTER_GET_INTEREST = 'FILTER_GET_INTEREST',
  FILTER_SET_INTEREST = 'FILTER_SET_INTEREST',

  FILTER_SET_AGE_RANGE = 'FILTER_SET_AGE_RANGE',

  FILTER_SET_MAX_DISTANCE = 'FILTER_SET_MAX_DISTANCE',

  FILTER_SET_GLOBAL = 'FILTER_SET_GLOBAL',

  FILTER_CLEAR_ALL = 'FILTER_CLEAR_ALL',
  FILTER_RESET_ALL = 'FILTER_RESET_ALL',

  FILTER_SET_LOCATION = 'FILTER_SET_LOCATION',
  FILTER_DELETE_LOCATION = 'FILTER_DELETE_LOCATION',

  FILTER_SEARCH_IG_USERNAME = 'FILTER_SEARCH_IG_USERNAME',
  FILTER_SAVE_IG_USERNAME = 'FILTER_SAVE_IG_USERNAME',
  SAVE_FILTER_DATA = 'SAVE_FILTER_DATA',
}

// ----------------------------------------
// Filters General
// ----------------------------------------
export interface GetFiltersGeneralAction extends Action {
  type: FiltersActionTypes.FILTER_GET_GENERAL;
  payload: ActionCallback;
}

export interface SaveFiltersGeneralAction extends Action {
  type: FiltersActionTypes.FILTER_SAVE_GENERAL;
  payload: FiltersGeneralData;
}

export interface ResetFiltersGeneralAction extends Action {
  type: FiltersActionTypes.FILTER_RESET_ALL;
  payload: ActionCallback;
}

export interface ActionSearchNearPlace extends Action {
  type: ActionTypes.SEARCH_NEAR_PLACE;
  payload: ActionSearchNearPlacePayload;
}

// ----------------------------------------
// Gender
// ----------------------------------------
export interface GetGendersAction extends Action {
  type: FiltersActionTypes.FILTER_GET_GENDERS;
  payload: ActionCallback;
}

export interface SetGenderAction extends Action {
  type: FiltersActionTypes.FILTER_SET_GENDER;
  payload: {
    genders: any[];
    callback: ActionCallback;
  };
}

export interface DeleteGenderAction extends Action {
  type: FiltersActionTypes.FILTER_DELETE_GENDER;
  payload: {
    gender: any;
    callback: ActionCallback;
  };
}

// ----------------------------------------
// Sexual Orientation
// ----------------------------------------
export interface GetSexualOrientationAction extends Action {
  type: FiltersActionTypes.FILTER_GET_SEXUAL_ORIENTATION;
  payload: ActionCallback;
}

export interface SetSexualOrientationAction extends Action {
  type: FiltersActionTypes.FILTER_SET_SEXUAL_ORIENTATION;
  payload: {
    sexualOrientations: any[];
    callback: ActionCallback;
  };
}

// ----------------------------------------
// Categories
// ----------------------------------------
export interface GetCategoriesAction extends Action {
  type: FiltersActionTypes.FILTER_GET_CATEGORIES;
  payload: ActionCallback;
}

export interface SetCategoriesAction extends Action {
  type: FiltersActionTypes.FILTER_SET_CATEGORIES;
  payload: {
    isFromSetting?: boolean;
    categories: any[];
    callback: ActionCallback;
  };
}

// ----------------------------------------
// CareerStrengths
// ----------------------------------------
export interface SetCareerStrengthsAction extends Action {
  type: FiltersActionTypes.FILTER_SET_CAREER_STRENGTHS;
  payload: {
    items: any[];
    callback: ActionCallback;
  };
}

// ----------------------------------------
// Auction Status
// ----------------------------------------
export interface GetAuctionStatusAction extends Action {
  type: FiltersActionTypes.FILTER_GET_AUCTION_STATUS;
  payload: ActionCallback;
}

export interface SetAuctionStatusAction extends Action {
  type: FiltersActionTypes.FILTER_SET_AUCTION_STATUS;
  payload: {
    auctionStatusSelected: FilterAuctionStatusEnum;
    callback: ActionCallback;
  };
}

export interface SaveAuctionStatusAction extends Action {
  type: FiltersActionTypes.FILTER_SAVE_AUCTION_STATUS;
  payload: {
    auctionStatus: any;
  };
}

// ----------------------------------------
// Interests
// ----------------------------------------
export interface GetInterestsAction extends Action {
  type: FiltersActionTypes.FILTER_GET_INTEREST;
  payload: ActionCallback;
}

export interface SetInterestsAction extends Action {
  type: FiltersActionTypes.FILTER_SET_INTEREST;
  payload: {
    interests: any[];
    callback: ActionCallback;
  };
}

// ----------------------------------------
// Age Range
// ----------------------------------------
export interface SetAgeRangeAction extends Action {
  type: FiltersActionTypes.FILTER_SET_AGE_RANGE;
  payload: {
    min: number;
    max: number;
    callback: ActionCallback;
  };
}

// ----------------------------------------
// Disntance
// ----------------------------------------
export interface SetMaxDistanceAction extends Action {
  type: FiltersActionTypes.FILTER_SET_MAX_DISTANCE;
  payload: {
    distance: number;
    unit: string;
    callback: ActionCallback;
  };
}

// ----------------------------------------
// Max Disntance
// ----------------------------------------
export interface FilterClearAllAction extends Action {
  type: FiltersActionTypes.FILTER_CLEAR_ALL;
  payload: ActionCallback;
}

export interface FilterSaveFindProfilesPayload extends ActionCallback {
  findProfiles: FindProfiles[];
}

// ----------------------------------------
// Find Profiles
// ----------------------------------------
export interface FilterSaveFindProfiles extends Action {
  type: FiltersActionTypes.FILTER_SAVE_FIND_PROFILES;
  payload: FilterSaveFindProfilesPayload;
}

// ----------------------------------------
// Languages
// ----------------------------------------
export interface GetLanguagesAction extends Action {
  type: FiltersActionTypes.FILTER_GET_LANGUAGES;
  payload: ActionCallback;
}

export interface SetLanguagesAction extends Action {
  type: FiltersActionTypes.FILTER_SET_LANGUAGES;
  payload: {
    languages: any[];
    callback: ActionCallback;
  };
}

// ----------------------------------------
// Location
// ----------------------------------------
export interface SetLocationAction extends Action {
  type: FiltersActionTypes.FILTER_SET_LOCATION;
  payload: {
    city: City;
    callback: ActionCallback;
  };
}

export interface DeleteLocationAction extends Action {
  type: FiltersActionTypes.FILTER_DELETE_LOCATION;
  payload: ActionCallback;
}

// ----------------------------------------
// Global
// ----------------------------------------
export interface SetFilterGlobalAction extends Action {
  type: FiltersActionTypes.FILTER_SET_GLOBAL;
  payload: {
    global: boolean;
    callback: ActionCallback;
  };
}

// ----------------------------------------
// IG Username
// ----------------------------------------
export interface SearchIGUsernameAction extends Action {
  type: FiltersActionTypes.FILTER_SEARCH_IG_USERNAME;
  payload: {
    keyword: string;
    callback: ActionCallback;
  };
}

export interface SaveIGUsernameAction extends Action {
  type: FiltersActionTypes.FILTER_SAVE_IG_USERNAME;
  payload: {
    instaUsername: string;
  };
}

export interface SaveFilterDataAction extends Action {
  type: FiltersActionTypes.SAVE_FILTER_DATA;
  payload: FilterData;
}

export type FiltersAction =
  | FilterClearAllAction
  | ResetFiltersGeneralAction
  | FilterSaveFindProfiles
  | GetFiltersGeneralAction
  | SaveFiltersGeneralAction
  | GetGendersAction
  | SetGenderAction
  | DeleteGenderAction
  | GetSexualOrientationAction
  | SetSexualOrientationAction
  | GetCategoriesAction
  | SetCategoriesAction
  | SetCareerStrengthsAction
  | GetAuctionStatusAction
  | SetAuctionStatusAction
  | SaveAuctionStatusAction
  | GetInterestsAction
  | SetInterestsAction
  | SetAgeRangeAction
  | SetMaxDistanceAction
  | GetLanguagesAction
  | SetLanguagesAction
  | SetLocationAction
  | DeleteLocationAction
  | SetFilterGlobalAction
  | SearchIGUsernameAction
  | SaveIGUsernameAction
  | SaveFilterDataAction
  | ActionLogout;
