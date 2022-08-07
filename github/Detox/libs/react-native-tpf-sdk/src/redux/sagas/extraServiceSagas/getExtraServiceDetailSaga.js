import { put, call, all } from 'redux-saga/effects';
import {
  apiGetAddedServicesProductDetail,
  apiGetChildrenCategoryById
} from '../../../services/api/extraServiceApi';
import { getShowAlertError } from '../../actions/system';
import { SYSTEM_ERROR } from '../../../constants/errors';

export function* getExtraServiceDetailSaga(obj) {
  const { CategoryId, callback } = obj.payload;
  try {
    const [detail, categoryChildren] = yield all([
      call(apiGetAddedServicesProductDetail, { CategoryId }),
      call(apiGetChildrenCategoryById, { id: CategoryId })
    ]);
    if (detail.status === 200 && categoryChildren.status === 200) {
      callback(detail.data?.result?.categoryInfo, categoryChildren?.data?.result?.items);
      return;
    }
    callback(null, []); //empty data
    yield put(getShowAlertError(SYSTEM_ERROR));
  } catch (error) {
    callback(null, []); //empty data
    yield put(getShowAlertError(SYSTEM_ERROR));
  }
}
