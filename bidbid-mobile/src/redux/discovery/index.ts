import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';
import { DiscoveryData } from '@/redux/discovery/reducer';
import { Auction } from '@/models';
import { FindProfiles } from '@/models/findProfiles';

// Action Types
export enum DiscoveryActionTypes {
  GET_DISCOVERY = 'GET_DISCOVERY',
  GET_TOTAL_DONATE = 'GET_TOTAL_DONATE',
  SAVE_DISCOVERY = 'SAVE_DISCOVERY',
  SAVE_DISCOVERY_WITH_FILTER = 'SAVE_DISCOVERY_WITH_FILTER',
  GET_DISCOVERY_DETAIL = 'GET_DISCOVERY_DETAIL',
  SAVE_DISCOVERY_DETAIL = 'SAVE_DISCOVERY_DETAIL',
  SET_INDEX_DISCOVERY = 'SET_INDEX_DISCOVERY',
  LIKE_DISCOVERY = 'LIKE_DISCOVERY',
  REVERT_LIKE_DISCOVERY = 'REVERT_LIKE_DISCOVERY',
  BID_MAX = 'BID_MAX',
  UN_LIKE_DISCOVERY = 'UN_LIKE_DISCOVERY',
  LOG_OUT = 'LOG_OUT',
  INCREASE_INDEX = 'INCREASE_INDEX',
  TRIGGER_END_TIME = 'TRIGGER_END_TIME',
  SHOW_DISCOVERY_LOADING = 'SHOW_DISCOVERY_LOADING',
  HIDE_DISCOVERY_LOADING = 'HIDE_DISCOVERY_LOADING',
}

export interface DiscoveryState {
  discovery: DiscoveryData;
}

export interface DiscoveryPhoto {
  id: number;
  isVerified: boolean;
  key: string;
  order: number;
  size: number;
  test: boolean;
  type: string;
  url: string;
}

export interface DiscoveryLanguage {
  id: number;
  name?: string;
}

export interface DiscoveryInterest {
  id: number;
  name?: string;
}

export interface DiscoveryStrengths {
  id: number;
  name?: string;
}

export interface DiscoveryCategories {
  id: number;
  name?: string;
}

export interface DiscoveryRate {
  id: number;
  score: string;
  userId: string;
  ratedById: string;
}

export interface DiscoveryCity {
  id: number;
  name?: string;
  address?: string;
  state?: string;
  country?: string;
}

export interface DISCOVERY {
  id: string;
  phoneNumber: string;
  email: string;
  token: null;
  status: string;
  firstName: string;
  dateOfBirth: string;
  thumbnailId: string;
  likes: number;
  hideAge: boolean;
  avatar: DiscoveryPhoto;
  thumbnail: DiscoveryPhoto;
  genderId: number;
  languageId: any;
  gender: {
    id: number;
    name: string;
    code: number;
    slug: string;
  };
  auctions: Auction[];
  language: any;
  photos: any;
  authProviders: any;
  auctionOnly: boolean;
  city?: DiscoveryCity;
  cityId: string;
  company?: {
    id: string;
    name: string;
  };
  description: string;
  isShowGender: boolean;
  isShowSexual: boolean;
  jobTitle: string;
  job?: {
    id: string;
    name: string;
  };
  languageApp: string;
  lastName: string;
  maxDistance: number;
  schoolId: string;
  school?: {
    id: string;
    name: string;
  };
  showDistanceIn: string;
  showMe: any;
  instagramUsername?: string;
  languages?: DiscoveryLanguage[];
  donate?: string | number;
  interests?: DiscoveryInterest[];
  strengths?: DiscoveryStrengths[];
  categories?: DiscoveryCategories[];
  rates?: DiscoveryRate[];
}

export interface ActionDiscoveryPayload extends ActionCallback {
  perPage: number;
  isFilter?: boolean;
  filterGlobal?: boolean;
  latitude?: number;
  longitude?: number;
  instaUsername?: string;
  showLoading?: boolean;
  findProfiles?: FindProfiles[];
}

export interface ActionDiscovery extends Action {
  type: DiscoveryActionTypes.GET_DISCOVERY;
  payload: ActionDiscoveryPayload;
}

export interface ActionDiscoveryDetailPayload extends ActionCallback {
  userId: string;
}

export interface ActionSaveDiscoveryDetailPayload extends ActionCallback {
  userId: string;
  data: DISCOVERY;
}

export interface ActionDiscoveryDetail extends Action {
  type: DiscoveryActionTypes.GET_DISCOVERY_DETAIL;
  payload: ActionDiscoveryDetailPayload;
}

export interface ActionSaveDiscoveryDetail extends Action {
  type: DiscoveryActionTypes.SAVE_DISCOVERY_DETAIL;
  payload: ActionSaveDiscoveryDetailPayload;
}

export interface ActionSetIndexDiscoveryPayload {
  index: number;
  noReset?: boolean;
  findProfiles?: FindProfiles[];
}

export interface ActionSetIndexDiscovery extends Action {
  type: DiscoveryActionTypes.SET_INDEX_DISCOVERY;
  payload: ActionSetIndexDiscoveryPayload;
}

export interface ActionLikeDiscoveryPayload extends ActionCallback {
  userId: string;
  isLiked?: boolean;
  userAuthId?: string;
}

export interface ActionRevertLikeDiscoveryPayload extends ActionCallback {
  userId: string;
}

export interface ActionLikeDiscovery extends Action {
  type: DiscoveryActionTypes.LIKE_DISCOVERY;
  payload: ActionLikeDiscoveryPayload;
}

export interface ActionRevertLikeDiscovery extends Action {
  type: DiscoveryActionTypes.REVERT_LIKE_DISCOVERY;
  payload: ActionRevertLikeDiscoveryPayload;
}

export interface ActionBidMaxPayload extends ActionCallback {
  userId?: string;
  index?: number;
}

export interface ActionBidMax extends Action {
  type: DiscoveryActionTypes.BID_MAX;
  payload: ActionBidMaxPayload;
}

export interface ActionTriggerEndTime extends Action {
  type: DiscoveryActionTypes.TRIGGER_END_TIME;
}

export interface ActionIncreaseIndex extends Action {
  type: DiscoveryActionTypes.INCREASE_INDEX;
}

export interface ActionUnLikeDiscoveryPayload extends ActionCallback {
  userId: string;
  isLiked?: boolean;
  userAuthId?: string;
}

export interface ActionUnLikeDiscovery extends Action {
  type: DiscoveryActionTypes.UN_LIKE_DISCOVERY;
  payload: ActionUnLikeDiscoveryPayload;
}

export interface ActionSaveDiscoveryPayload extends ActionCallback {
  data: DISCOVERY[];
}

export interface ActionSaveDiscovery extends Action {
  type: DiscoveryActionTypes.SAVE_DISCOVERY;
  payload: ActionSaveDiscoveryPayload;
}

export interface ActionSaveDiscoveryWithFilter extends Action {
  type: DiscoveryActionTypes.SAVE_DISCOVERY_WITH_FILTER;
  payload: ActionSaveDiscoveryPayload;
}

export interface ActionShowDiscoveryLoading extends Action {
  type: DiscoveryActionTypes.SHOW_DISCOVERY_LOADING;
}

export interface ActionHideDiscoveryLoading extends Action {
  type: DiscoveryActionTypes.HIDE_DISCOVERY_LOADING;
}

export interface ActionLogout extends Action {
  type: DiscoveryActionTypes.LOG_OUT;
}

export type DiscoveryAction =
  | ActionTriggerEndTime
  | ActionSaveDiscovery
  | ActionBidMax
  | ActionIncreaseIndex
  | ActionSaveDiscoveryWithFilter
  | ActionLikeDiscovery
  | ActionRevertLikeDiscovery
  | ActionDiscovery
  | ActionDiscoveryDetail
  | ActionSaveDiscoveryDetail
  | ActionSetIndexDiscovery
  | ActionUnLikeDiscovery
  | ActionShowDiscoveryLoading
  | ActionHideDiscoveryLoading
  | ActionLogout;
