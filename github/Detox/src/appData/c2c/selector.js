import {createSelector} from 'reselect';

const c2cState = state => state.c2cState;

export const getVisitedItemsC2C = createSelector(c2cState, item => {
  return item.visitedItems;
});
