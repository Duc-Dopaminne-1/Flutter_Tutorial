import { City } from '@/models';
import { Discovery } from '@/services/discovery';
import { Filters } from '@/services/filters';
import { FilterAuctionStatusEnum } from './types';

//General
export const getFiltersGeneral = async () => {
  try {
    const response = await Filters.getFiltersGeneral();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getInterests = async () => {
  try {
    const response = await Filters.getInterests();
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const resetFiltersGeneral = async () => {
  try {
    const response = await Filters.resetFiltersGeneral();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

//Gender

export const setFilterGender = async (genders: any[]) => {
  try {
    const response = await Filters.setFiltersGender(genders);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const deleteFilterGender = async (gender: any) => {
  try {
    const response = await Filters.deleteFilterGender(gender);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

//Sexual Orientations
export const setFiltersSexualOrientations = async (sexualOrientations: any[]) => {
  try {
    const response = await Filters.setFiltersSexualOrientations(sexualOrientations);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

//Categories
export const setFilterCategories = async (categories: any[], isFromSetting: boolean) => {
  try {
    const response = await Filters.setFilterCategories(categories, isFromSetting);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

// CareerStrengths
export const setFilterCareerStrengths = async (items: any[]) => {
  try {
    const response = await Filters.setFilterCareerStrengths(items);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

//Interests
export const setFilterInterests = async (interests: any[]) => {
  try {
    const response = await Filters.setFilterInterests(interests);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

//Max Distance
export const setFilterDistance = async (unit: string, max: number) => {
  try {
    const response = await Filters.setFilterDistance(unit, max);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

//Age Range
export const setFilterAgeRange = async (min: number, max: number) => {
  try {
    const response = await Filters.setFilterAgeRange(min, max);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

//Languages
export const setFilterLanguages = async (languages: any[]) => {
  try {
    const response = await Filters.setFilterLanguages(languages);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

//Location
export const setFilterLocation = async (city: City) => {
  try {
    const response = await Filters.setFilterLocation(city);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const deleteFilterLocation = async () => {
  try {
    const response = await Filters.deleteFilterLocation();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const setFilterGlobal = async (global: boolean) => {
  try {
    const response = await Filters.setFilterGlobal(global);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

//Auction Status

export const setFilterAuctionStatus = async (auctionStatus: FilterAuctionStatusEnum) => {
  try {
    const response = await Filters.setFilterAuctionStatus(auctionStatus);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

//IG Username

export const searchIGUsername = async (keyword: string) => {
  try {
    const response = await Discovery.searchIGUsername(keyword);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
