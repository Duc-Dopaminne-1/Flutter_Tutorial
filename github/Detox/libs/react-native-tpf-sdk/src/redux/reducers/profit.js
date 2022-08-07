import { MEMBER_PROFIT } from '../actionsType';

const initialState = {
  profitList: [],
  profitCount: 0,
  profit: null
};

const profit = (state = initialState, action) => {
  switch (action.type) {
    case MEMBER_PROFIT.GET_MEMBER_PROFIT.SUCCESS: {
      return {
        ...state,
        profitList: [...action.payload.items]
      };
    }
    default:
      return state;
  }
};

export default profit;
