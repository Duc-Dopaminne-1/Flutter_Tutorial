import { LINK } from '../actionsType';

const initialState = {
  link: {}
};

const link = (state = initialState, action) => {
  switch (action.type) {
    case LINK.GET_LINK.SUCCESS: {
      const { link, imageUrl } = action.payload;
      const newData = { link, imageUrl };
      return {
        ...state,
        link: newData
      };
    }
    case LINK.GET_LINK.FAILURE: {
      return {
        ...state,
        loading: false
      };
    }

    default:
      return state;
  }
};

export default link;
