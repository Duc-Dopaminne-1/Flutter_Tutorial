import _ from 'lodash';
const initialState = {};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case 'ENTITIES_UPDATE':
      return _.merge({}, state, action.payload);
    case 'ENTITIES_INIT':
      const entities = _.merge({}, state, action.payload);
      return entities;
    case 'LOGOUT':
      return initialState;
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
