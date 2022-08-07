/* eslint-disable @typescript-eslint/ban-types */
import { ActionTypes } from '../auth';
import { FilterAuctionStatusEnum, FilterCategoriesEnum, FiltersAction, FiltersActionTypes } from './types';
import { AuctionStatusDumpData } from './types';
import { FindProfiles } from '@/models/findProfiles';

export interface FiltersInit {
  filters: FiltersGeneralData;
}

export interface FilterData {
  categoriesList?: {
    name?: string;
    esName?: string;
    id: number;
  }[];
  gendersList?: {
    id: number;
    name?: string;
    esName?: string;
  }[];
  careerStrengthsList?: {
    name?: string;
    esName?: string;
    id: number;
  }[];
  interestsList?: {
    name?: string;
    esName?: string;
    id: number;
  }[];
  sexualOrientationsList?: {
    name?: string;
    esName?: string;
    id: number;
  }[];
  languagesList?: {
    name?: string;
    esName?: string;
    id: number;
  }[];
}

export interface FiltersGeneralData {
  ageRange: {
    min?: number;
    max?: number;
  };
  categories: {
    name?: string;
    id?: number;
  }[];
  findProfiles: FindProfiles[];
  userCategories: {
    name?: string;
    id?: number;
  }[];
  strengths: {
    name?: string;
    id?: number;
  }[];
  distance: {
    unit?: string;
    max?: number;
  };
  genders?: {
    id?: number;
    name?: string;
  }[];
  interests: {
    name?: string;
    id?: number;
  }[];
  sexualOrientations: {
    name?: string;
    id?: number;
  }[];
  auctionStatus?: {
    id?: number;
    name?: string;
  };
  languages?: {
    name?: string;
    id?: number;
  }[];
  location: any;
  global: boolean;
  status: FilterAuctionStatusEnum;
  categoriesFilter: FilterCategoriesEnum;
  instaUsername: string;
  shouldGetDiscovery: boolean;
  data: FilterData;
}

const initialState: FiltersGeneralData = {
  ageRange: {
    min: 18,
    max: 100,
  },
  categories: [],
  findProfiles: [],
  userCategories: [],
  strengths: [],
  languages: [],
  distance: {
    unit: 'Km',
    max: 100,
  },
  location: null,
  genders: [],
  interests: [],
  sexualOrientations: [],
  auctionStatus: AuctionStatusDumpData[0],
  global: false,
  status: FilterAuctionStatusEnum.ALL,
  categoriesFilter: FilterCategoriesEnum.CAREER,
  instaUsername: '',
  shouldGetDiscovery: true,
  data: {
    categoriesList: [],
    languagesList: [],
    gendersList: [],
    careerStrengthsList: [],
    interestsList: [],
    sexualOrientationsList: [],
  },
};

const reducer = (state: FiltersGeneralData = initialState, action: FiltersAction): FiltersGeneralData => {
  switch (action.type) {
    case FiltersActionTypes.FILTER_SAVE_GENERAL:
      const data = action.payload;
      const auctionStatusBefore = state.auctionStatus ? state.auctionStatus : AuctionStatusDumpData[0];
      const instaUsernameBefore = state.instaUsername || '';

      return {
        ...data,
        auctionStatus: auctionStatusBefore,
        instaUsername: instaUsernameBefore,
        findProfiles: state.findProfiles.length > 0 ? state.findProfiles : [],
        data: state.data,
      };
    case FiltersActionTypes.FILTER_SAVE_AUCTION_STATUS:
      const { auctionStatus } = action.payload;
      return {
        ...state,
        auctionStatus: auctionStatus,
      };
    case FiltersActionTypes.FILTER_SAVE_IG_USERNAME:
      const { instaUsername } = action.payload;
      return {
        ...state,
        instaUsername,
      };
    case FiltersActionTypes.SAVE_FILTER_DATA:
      const { categoriesList, languagesList, gendersList, interestsList, sexualOrientationsList, careerStrengthsList } = action.payload;
      return {
        ...state,
        data: {
          categoriesList: categoriesList || state.data.categoriesList,
          languagesList: languagesList || state.data.languagesList,
          careerStrengthsList: careerStrengthsList || state.data.careerStrengthsList,
          gendersList: gendersList || state.data.gendersList,
          interestsList: interestsList || state.data.interestsList,
          sexualOrientationsList: sexualOrientationsList || state.data.sexualOrientationsList,
        },
      };
    case FiltersActionTypes.FILTER_SAVE_FIND_PROFILES:
      return {
        ...state,
        findProfiles: action.payload.findProfiles,
      };
    case FiltersActionTypes.FILTER_CLEAR_ALL:
      return {
        ...initialState,
        data: state.data,
      };
    case FiltersActionTypes.FILTER_RESET_ALL:
      return {
        ...initialState,
        data: state.data,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...initialState,
        data: state.data,
        shouldGetDiscovery: false,
      };

    default:
      return state;
  }
};

export default reducer;
