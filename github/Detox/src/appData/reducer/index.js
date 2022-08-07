import {combineReducers} from 'redux';

import {reducer as appSettingsReducer} from '../appSettings/reducer';
import {reducer as authStateReducer} from '../authState/reducer';
import {reducer as c2cReducer} from '../c2c/reducer';
import {reducer as userReducer} from '../user/reducer';

export const reducer = combineReducers({
  appSettings: appSettingsReducer,
  user: userReducer,
  authState: authStateReducer,
  c2cState: c2cReducer,
});
