import app from '@screens/manager/App/reducer';
import { reducer as authReducer } from '@modules/auth';
import { combineReducers } from 'redux';
import entitiesReducer from './entities';
import { reducer as reducerAppState } from '@modules/appState';
import { reducer as reducerNetworkStatus } from '@modules/network';
import { reducer as configSaga } from '@src/modules/Config';
import { reducer as reducerCompany } from '@modules/Company';
import { unitReducer } from '@src/modules/Units';
import { reducer as reducerMaintenance } from '@modules/Maintenance';
import { reducer as reducerBulletin } from '@modules/bulletin';
import { reducer as reducerFrontDesk } from '@modules/FrontDesk';
import { reducer as reducerShoppingStore } from '@modules/shopping_store';
import { reducer as reducerCalendar } from '@modules/calendar';
import { reducerNotification } from '@src/modules/notifications/reducer';
import { reducer as reducerFinancial } from '@modules/financial';

export default combineReducers({
  app,
  auth: authReducer,
  appState: reducerAppState,
  entities: entitiesReducer,
  networkStatus: reducerNetworkStatus,
  config: configSaga,
  company: reducerCompany,
  unit: unitReducer,
  maintenance: reducerMaintenance,
  bulletin: reducerBulletin,
  frontDesk: reducerFrontDesk,
  shoppingStore: reducerShoppingStore,
  calendar: reducerCalendar,
  notifications: reducerNotification,
  financial: reducerFinancial,
});
