import { SYSTEM } from '../actionsType';

const initialState = {
  error: {},
  isError: false
};

const system = (state = initialState, action) => {
  switch (action.type) {
    case SYSTEM.SHOW_ERROR.STORE: {
      return {
        ...state,
        error: action.payload,
        isError: true
      };
    }
    case SYSTEM.CLEAR_ERROR.CLEAR: {
      return {
        ...state,
        error: {},
        isError: false
      };
    }

    default:
      return state;
  }
};

export default system;
