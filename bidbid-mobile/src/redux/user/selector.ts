import store from '@/redux/store';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers';

export const getUserId = () => {
  return store.getState().user.data.id;
};

export const getUserInfo = () => {
  return store.getState().user.data;
};

export const getUserLanguage = () => {
  return store.getState().user.data.appLanguage;
};

export const getUserStatus = () => {
  return store.getState().user.data.status;
};

export const userSelector = () => useSelector((state: RootState) => state.user);
