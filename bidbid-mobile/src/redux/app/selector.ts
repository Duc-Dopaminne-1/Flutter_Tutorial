import { useSelector } from 'react-redux';
import { RootState } from '../reducers';
import store from '../store';

export const getStatusFirstInstall = () => {
  return store.getState().app.setting.IS_FIRST_INSTALL;
};

export const getStatusFirstReview = () => {
  return store.getState().app.setting.IS_FIRST_REVIEW;
};

export const getStatusFirstMeetGreatPerson = () => {
  return store.getState().app.setting.IS_FIRST_MEET_GREAT_PERSON;
};

export const getStatusFirstMeetGreatVirtual = () => {
  return store.getState().app.setting.IS_FIRST_MEET_GREAT_VIRTUAL;
};

export const getSettingApp = () => {
  return store.getState().app.setting;
};

export const getSettingStartPrice = () => {
  return store.getState().app.setting.AUCTION_START_PRICE;
};

export const getLocalApp = () => {
  return store.getState().app.locale;
};

export const appLocaleSelector = () => useSelector((state: RootState) => state.app.locale);
