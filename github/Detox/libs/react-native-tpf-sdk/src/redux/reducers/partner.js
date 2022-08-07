import { PARTNER } from '../actionsType';

const initialState = {
  list: [],
  totalCount: 0,
  detail: {}
};

const partner = (state = initialState, action) => {
  switch (action.type) {
    case PARTNER.GET_PARTNER_LIST.SUCCESS: {
      return {
        ...state,
        list: action.payload.items,
        totalCount: action.payload.totalCount
      };
    }
    case PARTNER.GET_PARTNER_DETAIL.SUCCESS: {
      return {
        ...state,
        detail: action.payload.item
      };
    }

    default:
      return state;
  }
};

export default partner;
