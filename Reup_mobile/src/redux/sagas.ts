import { frontDeskSaga } from '@modules/FrontDesk';
import { all, fork } from 'redux-saga/effects';
import appSaga from '@screens/manager/App/saga';
import { authSaga } from '@modules/auth';
import { notificationSaga } from '@modules/notifications/saga';
import { maintenanceSaga } from '@modules/Maintenance';
import { configSaga } from '@src/modules/Config';
import { companySaga } from '@modules/Company';
import { unitSaga } from '@src/modules/Units';
import { bulletinSaga } from '@src/modules/bulletin';
import { saga as shoppingStoreSaga } from '@src/modules/shopping_store';
import { saga as calendarSaga } from '@src/modules/calendar';
import { financialSaga } from '@src/modules/financial';

export default function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(authSaga),
    fork(notificationSaga),
    fork(maintenanceSaga),
    fork(configSaga),
    fork(companySaga),
    fork(unitSaga),
    fork(bulletinSaga),
    fork(frontDeskSaga),
    fork(shoppingStoreSaga),
    fork(calendarSaga),
    fork(financialSaga),
  ]);
}
