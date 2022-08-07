import { takeLatest } from 'redux-saga/effects';
import { TERM_AND_CONDITION } from '../../actionsType';
import { getPrivacyPoilcySaga, getTermAndConditionListSaga } from './getTermAndConditionListSaga';

export default function* termAndConditionSagas() {
  yield takeLatest(TERM_AND_CONDITION.GET_TERM_AND_CONDITION.HANDLER, getTermAndConditionListSaga);
  yield takeLatest(TERM_AND_CONDITION.GET_PRIVACY_POLICY.HANDLER, getPrivacyPoilcySaga);
}
