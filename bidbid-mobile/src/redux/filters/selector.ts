import { deepCompareSelector } from '@/shared/processing';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers';
import store from '../store';

export const getFilter = () => {
  return store.getState().filters;
};

export const filterSelector = () => useSelector((state: RootState) => state.filters);

export const filterGenderSelector = () => useSelector((state: RootState) => state.filters.genders, deepCompareSelector);
export const filterSexualOrientationSelector = () =>
  useSelector((state: RootState) => state.filters.sexualOrientations, deepCompareSelector);
export const filterGlobalSelector = () => useSelector((state: RootState) => state.filters.global);
export const filterCategoriesSelectedSelector = () => useSelector((state: RootState) => state.filters.userCategories, deepCompareSelector);
export const filterAuctionStatusSelector = () => useSelector((state: RootState) => state.filters.status);
export const filterAgeRangeSelector = () => useSelector((state: RootState) => state.filters.ageRange, deepCompareSelector);
export const filterCareerStrengsSelector = () => useSelector((state: RootState) => state.filters.strengths, deepCompareSelector);
export const filterSocialInterestsSelector = () => useSelector((state: RootState) => state.filters.interests, deepCompareSelector);
export const filterLanguageSelector = () => useSelector((state: RootState) => state.filters.languages, deepCompareSelector);
export const filterDistanceSelector = () => useSelector((state: RootState) => state.filters.distance, deepCompareSelector);
export const filterInstaUsernameSelector = () => useSelector((state: RootState) => state.filters.instaUsername);
export const filterFindProfileSelector = () => useSelector((state: RootState) => state.filters.findProfiles);
