import { takeLatest } from 'redux-saga/effects';
import { CONTACT } from '../../actionsType';
import { getContactDetailSaga } from './getContactDetailSaga';
import { getContactsSaga } from './getContactsSaga';

export default function* contactSagas() {
  yield takeLatest(CONTACT.GET_CONTACTS.HANDLER, getContactsSaga);
  yield takeLatest(CONTACT.GET_CONTACT_DETAIL.HANDLER, getContactDetailSaga);
}
