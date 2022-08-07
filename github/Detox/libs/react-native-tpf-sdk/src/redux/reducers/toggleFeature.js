import { TOOGLE_FEATURE } from '../actionsType';

const initialState = {
  featureList: ['credit', 'insurance']
};

const toggleFeature = (state = initialState, action) => {
  switch (action.type) {
    case TOOGLE_FEATURE.GET_TOOGLE_FEATURE.HANDLER: {
      return {
        ...state
      };
    }

    case TOOGLE_FEATURE.GET_TOOGLE_FEATURE.SUCCESS: {
      return {
        ...state,
        featureList: [...action.payload.data]
      };
    }

    default:
      return state;
  }
};

export default toggleFeature;
