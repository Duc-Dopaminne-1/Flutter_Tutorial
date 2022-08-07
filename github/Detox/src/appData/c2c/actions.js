import {ADD_ITEM_VISITED_C2C, CLEAR_VISITED_ITEMS_C2C} from './actionTypes';

export const clearVisitedItemsC2C = () => ({
  type: CLEAR_VISITED_ITEMS_C2C,
});

export const addItemVisitedC2C = propertyPostId => {
  return {
    type: ADD_ITEM_VISITED_C2C,
    payload: propertyPostId,
  };
};
