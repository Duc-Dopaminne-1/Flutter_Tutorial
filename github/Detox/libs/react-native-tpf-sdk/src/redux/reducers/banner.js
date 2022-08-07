import { BANNER } from '../actionsType';

const initialState = {
  list: [],
  detail: {}
};

const banner = (state = initialState, action) => {
  switch (action.type) {
    case BANNER.GET_BANNER.SUCCESS: {
      return {
        ...state,
        list: [...action.payload.items]
      };
    }

    case BANNER.GET_BANNER_DETAIL.SUCCESS: {
      return {
        ...state,
        detail: action.payload.item
      };
    }

    default:
      return state;
  }
};

export default banner;
