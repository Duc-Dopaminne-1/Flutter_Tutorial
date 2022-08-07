import { Schema, denormalize } from 'normalizr';
import { IListItemState } from './interface';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { initialListState } from './reducer';

const entitiesSelector = (state: any) => state.entities;
export const getListState = (listName: string) => (state: any) => _.get(state, ['lists', listName], initialListState);
export const getDenormalizedListState = (listName: string, schemas: Schema) => {
  const getStateList = (state: any) => _.get(state, ['lists', listName], initialListState);
  const selector = createSelector(getStateList, entitiesSelector, (state: IListItemState, entities: any) => {
    return {
      ...state,
      data: denormalize(state.data, [schemas], entities) || [],
    };
  });
  return selector;
};

export default getListState;
