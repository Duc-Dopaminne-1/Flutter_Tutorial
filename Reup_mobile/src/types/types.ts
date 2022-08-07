import { IAuthState } from '@src/modules/auth/reducer';
import { IConfigState } from '@src/modules/Config/reducer';
import { IAppState } from '@src/modules/appState';
import { INetworkStatus } from '@src/modules/network';
import { ICompanyState } from '@src/modules/Company/reducer';
import { IUnitState } from '@src/modules/Units/reducer';
import { IMaintenanceState } from '@src/modules/Maintenance/reducer';
import { IBulletinState } from '@src/modules/bulletin/reducer';
import { IFrontDeskState } from '@src/modules/FrontDesk/reducer';
import { IShoppingStoreState } from '@src/modules/shopping_store/reducer';
import { ICalendarState } from '@src/modules/calendar/reducer';
import { IFinancialState } from '@src/modules/financial/reducer';

export interface RootState {
  auth: IAuthState;
  appState: IAppState;
  app: any;
  entities: any;
  networkStatus: INetworkStatus;
  config: IConfigState;
  company: ICompanyState;
  unit: IUnitState;
  maintenance: IMaintenanceState;
  bulletin: IBulletinState;
  frontDesk: IFrontDeskState;
  shoppingStore: IShoppingStoreState;
  calendar: ICalendarState;
  notifications: any;
  financial: IFinancialState;
}
