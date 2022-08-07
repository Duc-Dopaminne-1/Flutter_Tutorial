import store from '@/redux/store';

export const getListDiscovery = () => {
  return store.getState().discovery.data;
};
