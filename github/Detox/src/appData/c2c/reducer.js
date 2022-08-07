import {ADD_ITEM_VISITED_C2C, CLEAR_VISITED_ITEMS_C2C} from './actionTypes';

export const initialState = {
  visitedItems: [],
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ADD_ITEM_VISITED_C2C:
      const newVisitedItems = state.visitedItems.filter(e => e !== action.payload);
      newVisitedItems.unshift(action.payload);
      if (newVisitedItems.length > 6) {
        newVisitedItems.pop();
      }
      return {...state, visitedItems: newVisitedItems};
    case CLEAR_VISITED_ITEMS_C2C:
      return {...state, visitedItems: []};
    default:
      return state;
  }
};
