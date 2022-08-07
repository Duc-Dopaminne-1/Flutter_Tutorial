import { OFFER } from '../actionsType';

const initialState = {
  highlightOffers: [],
  offerList: [],
  offerCount: 0,
  offer: null
};

const offer = (state = initialState, action) => {
  switch (action.type) {
    case OFFER.GET_HIGHLIGHT_OFFER.SUCCESS: {
      return {
        ...state,
        highlightOffers: [...action.payload.items]
      };
    }

    case OFFER.GET_OFFER_LIST.SUCCESS: {
      return {
        ...state,
        offerList: [...action.payload.items],
        offerCount: action.payload.totalCount
      };
    }

    case OFFER.GET_OFFER_DETAIL.SUCCESS: {
      return {
        ...state,
        offer: action.payload.item
      };
    }

    default:
      return state;
  }
};

export default offer;
