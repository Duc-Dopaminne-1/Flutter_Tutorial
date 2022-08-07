import { takeLatest } from 'redux-saga/effects';
import { MEMBER_PROFIT } from '../../actionsType';
import { getProfitListSaga } from './getProfitListSaga';

export default function* profitSagas() {
  yield takeLatest(MEMBER_PROFIT.GET_MEMBER_PROFIT.HANDLER, getProfitListSaga);
}
