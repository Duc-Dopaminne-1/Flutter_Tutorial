import { TERM_AND_CONDITION } from '../actionsType';

const initialState = {
  termAndConditionList: [],
  termAndConditionCount: 0,
  termAndCondition: null,
  privacyList: []
};

const termAndCondition = (state = initialState, action) => {
  switch (action.type) {
    case TERM_AND_CONDITION.GET_TERM_AND_CONDITION.SUCCESS: {
      return {
        ...state,
        termAndConditionList: [...action.payload.items]
      };
    }

    case TERM_AND_CONDITION.GET_PRIVACY_POLICY.SUCCESS: {
      return {
        ...state,
        privacyList: action.payload.items
      };
    }

    default:
      return state;
  }
};

export default termAndCondition;
