const initialState = {};

const loadingReducer = (state = initialState, action) => {
  const { type } = action;
  const matches = /(.*)_(HANDLER|SUCCESS|FAILURE|END)/.exec(type);
  if (!matches) {
    return state;
  }
  const [, requestName, requestState] = matches;
  const newState = {
    ...state,
    [requestName]: requestState === 'HANDLER'
  };
  return newState;
};

export default loadingReducer;
