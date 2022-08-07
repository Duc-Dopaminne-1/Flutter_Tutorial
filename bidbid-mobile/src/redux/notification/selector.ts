import { deepCompareSelector } from '../../shared/processing';
import { useSelector } from 'react-redux';
import store from '../store';
import { NotificationInit } from './reducer';
export const getNotficationStore = () => {
  return store.getState().notification;
};

export const notificationSettngSelector = () => useSelector((state: NotificationInit) => state.notification.setting, deepCompareSelector);
