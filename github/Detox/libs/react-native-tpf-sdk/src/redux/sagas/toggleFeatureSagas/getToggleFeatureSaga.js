import { call, put } from 'redux-saga/effects';
import { apiGetToggleFeature } from '../../../services/api/toggleFeature';
import { getToggleFeatureFailure, getToggleFeatureSuccess } from '../../actions/toggleFeature';

export function* getToggleFeatureSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetToggleFeature, params);
    if (data.status === 200) {
      yield put(
        getToggleFeatureSuccess({
          data: data.data.result.featureList
        })
      );
    } else {
      yield put(getToggleFeatureFailure(data));
    }
  } catch (error) {
    yield put(getToggleFeatureFailure(error));
  }
}
