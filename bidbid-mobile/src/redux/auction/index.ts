import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';
import { BaseModel, Auction, DURATION } from '@/models';
import { ActionCharitiesPayload } from '@/redux/auction/actions';

// Action Types
export enum ActionTypes {
  GET_DURATIONS = 'GET_DURATIONS',
  SET_DURATIONS = 'SET_DURATIONS',

  GET_CATEGORIES = 'GET_CATEGORIES',
  GET_DONATE_PERCENTS = 'GET_DONATE_PERCENTS',
  GET_CHARITIES = 'GET_CHARITIES',
  CREATE_AUCTION = 'CREATE_AUCTION',
  GET_AUCTION = 'GET_AUCTION',
  SEARCH_NEAR_PLACE = 'SEARCH_NEAR_PLACE',
  SEARCH_CITY = 'SEARCH_CITY',
  REQUEST_ADDITIONAL_CHARITY = 'REQUEST_ADDITIONAL_CHARITY',

  SAVE_AUCTION_DATA = 'SAVE_AUCTION_DATA',

  UPDATE_STATUS_AUCTION = 'UPDATE_STATUS_AUCTION',

  GET_MY_AUCTION_ACTIVE = 'GET_MY_AUCTION_ACTIVE',
  GET_MY_AUCTION_HISTORY = 'GET_MY_AUCTION_HISTORY',
  GET_MY_AUCTION_LASTED = 'GET_MY_AUCTION_LASTED',

  SET_AUCTION_DETAIL = 'SET_AUCTION_DETAIL',
}

export interface DurationProp {
  id: number;
  name: string;
  seconds?: number;
}

export interface Charities extends BaseModel {
  id: number;
  name: string;
  category: string;
  address: string;
  city: string;
  state: string;
  url: string;
  donationUrl: string;
  ein: string;
  latitude: string;
  longitude: string;
  zipCode: string;
}

export interface SaveAuctionDetailActionPayload extends ActionCallback {
  data: Auction;
}

export interface SaveAuctionDetailAction extends Action {
  type: ActionTypes.SET_AUCTION_DETAIL;
  payload: SaveAuctionDetailActionPayload;
}

export interface ActionSearchNearPlacePayload extends ActionCallback {
  lat: number;
  long: number;
  radius: number;
  type: string;
  pageToken?: string;
}

export interface ActionSearchNearPlace extends Action {
  type: ActionTypes.SEARCH_NEAR_PLACE;
  payload: ActionSearchNearPlacePayload;
}

export interface ActionSearchCityPayload extends ActionCallback {
  lat: number;
  long: number;
}

export interface ActionSearchCity extends Action {
  type: ActionTypes.SEARCH_CITY;
  payload: ActionSearchCityPayload;
}

export interface ActionUpdateStatusAuctionPayload extends ActionCallback {
  id: string;
}

export interface ActionUpdateStatusAuction extends Action {
  type: ActionTypes.UPDATE_STATUS_AUCTION;
  payload: ActionUpdateStatusAuctionPayload;
}

export interface ActionDurations extends Action {
  type: ActionTypes.GET_DURATIONS;
  payload: ActionCallback;
}

export interface ActionSetDurationsPayload extends ActionCallback {
  data: { duration: DURATION[]; timeMeet: DURATION[]; raffle: DURATION[] };
}

export interface ActionSetDurations extends Action {
  type: ActionTypes.SET_DURATIONS;
  payload: ActionSetDurationsPayload;
}

export interface ActionCategories extends Action {
  type: ActionTypes.GET_CATEGORIES;
  payload: ActionCallback;
}

export interface ActionDonatePercents extends Action {
  type: ActionTypes.GET_DONATE_PERCENTS;
  payload: ActionCallback;
}

export interface ActionCharities extends Action {
  type: ActionTypes.GET_CHARITIES;
  payload: ActionCharitiesPayload;
}

export interface CreateAuctionProp {
  durationId: number;
  categoryIds: number[];
  startingPrice: number;
  endNowPrice: number;
  reservePrice: number;
  donationPercentId: number;
  charityId: number;
  meetDate: string;
  meetPlace: {
    name: string;
    address: string;
    lng: number;
    lat: number;
  };
}

export interface ActionCreateAuctionPayload extends ActionCallback {
  data: CreateAuctionProp;
}

export interface ActionCreateAuction extends Action {
  type: ActionTypes.CREATE_AUCTION;
  payload: ActionCreateAuctionPayload;
}

export interface ActionGetAuction extends Action {
  type: ActionTypes.GET_AUCTION;
  payload: ActionCallback;
}

export interface SaveAuctionDataAction extends Action {
  type: ActionTypes.SAVE_AUCTION_DATA;
  payload: {
    auction: Auction;
  };
}

export interface RequestAdditionalCharityPayload extends ActionCallback {
  charityName: string;
  headquartersAddress: string;
}

export interface RequestAdditionalCharityAction extends Action {
  type: ActionTypes.REQUEST_ADDITIONAL_CHARITY;
  payload: RequestAdditionalCharityPayload;
}

export interface GetMyAuctionHistoryPayload {
  perPage?: number;
  offset?: any;
  callback?: ActionCallback;
}
export interface GetMyAuctionHistoryAction extends Action {
  type: ActionTypes.GET_MY_AUCTION_HISTORY;
  payload: GetMyAuctionHistoryPayload;
}

export interface GetMyAuctionActiveAction extends Action {
  type: ActionTypes.GET_MY_AUCTION_ACTIVE;
  payload: ActionCallback;
}

export interface GetMyAuctionLastedAction extends Action {
  type: ActionTypes.GET_MY_AUCTION_LASTED;
  payload: ActionCallback;
}

export type AuctionAction =
  | ActionDurations
  | ActionCategories
  | ActionDonatePercents
  | SaveAuctionDetailAction
  | ActionCharities
  | ActionCreateAuction
  | ActionSearchNearPlace
  | ActionSearchCity
  | ActionSetDurations
  | ActionGetAuction
  | SaveAuctionDataAction
  | RequestAdditionalCharityAction
  | GetMyAuctionHistoryAction
  | GetMyAuctionActiveAction
  | GetMyAuctionLastedAction;
