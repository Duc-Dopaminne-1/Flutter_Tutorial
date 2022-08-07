import store from '../store';

export const getCityCreateProfile = () => {
  return store.getState().createProfile.city;
};
