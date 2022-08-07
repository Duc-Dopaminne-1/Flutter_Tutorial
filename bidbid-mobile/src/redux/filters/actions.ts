import { FiltersActionTypes, FiltersAction, FilterAuctionStatusEnum, FilterSaveFindProfilesPayload } from './types';
import { ActionCallback } from '@/redux/auth';
import { FilterData, FiltersGeneralData } from './reducer';
import { City } from '@/models';
// ----------------------------------------
// Filters General
// ----------------------------------------
const getFiltersGeneral = (payload: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_GET_GENERAL,
  payload,
});

const saveFiltersGeneral = (payload: FiltersGeneralData): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SAVE_GENERAL,
  payload,
});

const saveFiltersFindProfiles = (payload: FilterSaveFindProfilesPayload): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SAVE_FIND_PROFILES,
  payload,
});

const saveFiltersData = (payload: FilterData): FiltersAction => ({
  type: FiltersActionTypes.SAVE_FILTER_DATA,
  payload,
});

const resetAllFiltersGeneral = (payload: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_RESET_ALL,
  payload,
});

// ----------------------------------------
// Gender
// ----------------------------------------
const getFilterGenders = (payload: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_GET_GENDERS,
  payload,
});

const setFilterGender = (genders: any[], callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_GENDER,
  payload: {
    genders: genders,
    callback: callback,
  },
});

const deleteFilterGender = (gender: any, callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_DELETE_GENDER,
  payload: {
    gender: gender,
    callback: callback,
  },
});

// ----------------------------------------
// Sexual Orientation
// ----------------------------------------
const getFilterSexualOrientation = (payload: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_GET_SEXUAL_ORIENTATION,
  payload,
});

const setFilterSexualOrientation = (sexualOrientations: any[], callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_SEXUAL_ORIENTATION,
  payload: {
    sexualOrientations: sexualOrientations,
    callback: callback,
  },
});

// ----------------------------------------
// Categories
// ----------------------------------------
const getFilterCategories = (payload: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_GET_CATEGORIES,
  payload,
});

const setFilterCategories = (categories: any[], callback: ActionCallback, isFromSetting = false): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_CATEGORIES,
  payload: {
    isFromSetting,
    categories: categories,
    callback: callback,
  },
});

// ----------------------------------------
// Career Strengths
// ----------------------------------------
const setFilterCareerStrengths = (items: any[], callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_CAREER_STRENGTHS,
  payload: {
    items,
    callback,
  },
});

// ----------------------------------------
// Auction Status
// ----------------------------------------
const getAuctionStatus = (payload: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_GET_AUCTION_STATUS,
  payload,
});

const setAuctionStatus = (auctionStatusSelected: FilterAuctionStatusEnum, callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_AUCTION_STATUS,
  payload: {
    auctionStatusSelected: auctionStatusSelected,
    callback: callback,
  },
});

const saveAuctionStatus = (auctionStatus: any): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SAVE_AUCTION_STATUS,
  payload: {
    auctionStatus: auctionStatus,
  },
});

// ----------------------------------------
// Interests
// ----------------------------------------
const getFilterInterests = (payload: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_GET_INTEREST,
  payload,
});

const setFilterInterests = (interests: any[], callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_INTEREST,
  payload: {
    interests: interests,
    callback: callback,
  },
});

// ----------------------------------------
// Age Range
// ----------------------------------------

const setFilterAgeRange = (min: number, max: number, callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_AGE_RANGE,
  payload: {
    min: min,
    max: max,
    callback: callback,
  },
});

// ----------------------------------------
// Distance
// ----------------------------------------;

const setFilterDistance = (unit: string, distance: number, callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_MAX_DISTANCE,
  payload: {
    unit: unit,
    distance: distance,
    callback: callback,
  },
});

// ----------------------------------------
// Categories
// ----------------------------------------
const getFilterLanguages = (payload: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_GET_LANGUAGES,
  payload,
});

const setFilterLanguages = (languages: any[], callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_LANGUAGES,
  payload: {
    languages: languages,
    callback: callback,
  },
});

// ----------------------------------------
// Location
// ----------------------------------------
const setFilterLocation = (city: City, callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_LOCATION,
  payload: {
    city: city,
    callback: callback,
  },
});

const deleteFilterLocation = (payload: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_DELETE_LOCATION,
  payload,
});

// ----------------------------------------
// Global
// ----------------------------------------;

const setFilterGlobal = (global: boolean, callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SET_GLOBAL,
  payload: {
    global: global,
    callback,
  },
});

// ----------------------------------------
// IG Username
// ----------------------------------------;

const searchIGUsername = (keyword: string, callback: ActionCallback): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SEARCH_IG_USERNAME,
  payload: {
    keyword,
    callback,
  },
});

const saveIGUsername = (instaUsername: any): FiltersAction => ({
  type: FiltersActionTypes.FILTER_SAVE_IG_USERNAME,
  payload: {
    instaUsername,
  },
});

export {
  getFiltersGeneral,
  saveFiltersGeneral,
  resetAllFiltersGeneral,
  //
  getFilterGenders,
  setFilterGender,
  deleteFilterGender,
  //
  getFilterSexualOrientation,
  setFilterSexualOrientation,
  //
  getFilterCategories,
  setFilterCategories,
  //
  setFilterCareerStrengths,
  //
  getAuctionStatus,
  setAuctionStatus,
  saveAuctionStatus,
  //
  getFilterInterests,
  setFilterInterests,
  //
  setFilterAgeRange,
  //
  setFilterDistance,
  //
  getFilterLanguages,
  setFilterLanguages,
  //
  setFilterLocation,
  deleteFilterLocation,
  //
  setFilterGlobal,
  //
  searchIGUsername,
  saveIGUsername,
  //
  saveFiltersData,
  saveFiltersFindProfiles,
};
