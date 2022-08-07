import { WORKFLOW } from '../actionsType';

const initialState = {
  workflowData: null
};

const workflow = (state = initialState, action) => {
  switch (action.type) {
    case WORKFLOW.GET_NEW_ACTION.HANDLER: {
      return {
        ...state,
        workflowData: null
      };
    }

    case WORKFLOW.GET_NEW_ACTION.SUCCESS: {
      return {
        ...state,
        workflowData: action.payload
      };
    }

    case WORKFLOW.GET_NEW_ACTION.CLEAR: {
      return {
        ...state,
        workflowData: null
      };
    }

    default:
      return state;
  }
};

export default workflow;
