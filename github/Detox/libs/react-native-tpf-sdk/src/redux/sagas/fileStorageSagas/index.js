import { FILE_STORAGE } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import { uploadFileSaga } from './uploadFileSaga';
import { scanIdCardSaga } from './scanIdCardSaga';

export default function* creditSaga() {
  yield takeLatest(FILE_STORAGE.UPLOAD.HANDLER, uploadFileSaga);
  yield takeLatest(FILE_STORAGE.SCAN_ID_CARD.HANDLER, scanIdCardSaga);
}
