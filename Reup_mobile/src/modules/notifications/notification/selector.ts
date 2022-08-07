import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { notification } from '@src/models/schemas';

const entitiesSelector = (state: any) => state.entities;
const selector = (id: string) => {
  const articleSelector = createSelector(entitiesSelector, (entities: any) => denormalize(id, notification, entities) || { loaded: false });

  return articleSelector;
};

export default selector;
