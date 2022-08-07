import { takeLatest } from 'redux-saga/effects';
import { TOOGLE_FEATURE } from '../../actionsType';
import { getToggleFeatureSaga } from './getToggleFeatureSaga';

export default function* toggleFeatureSagas() {
  yield takeLatest(TOOGLE_FEATURE.GET_TOOGLE_FEATURE.HANDLER, getToggleFeatureSaga);
}
