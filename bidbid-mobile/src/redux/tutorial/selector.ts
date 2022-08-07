import store from '../store';

export const getIndexTutorial = () => {
  return store.getState().tutorial.index;
};
