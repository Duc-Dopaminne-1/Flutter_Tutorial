import { all, fork } from 'redux-saga/effects'
import Saga from '@/redux-saga/saga/regular'

export const rootSaga = function* rootSaga() {
  yield all([fork(Saga)])
}
