import { call } from 'redux-saga/effects';
import { apiScanIdentityCard } from '../../../services/api/fileStorage';

export function* scanIdCardSaga(obj) {
  const { images, onCompleted } = obj.payload;
  try {
    const formData = new FormData();
    images.map(item => {
      formData.append(item.code, {
        uri: item.url,
        name: item?.filename || item?.url?.substring(item?.url?.lastIndexOf('/') + 1) || 'filename',
        type: item.type,
        size: item.size
      });
    });

    const response = yield call(apiScanIdentityCard, formData);

    if (response.status === 200) {
      onCompleted ? onCompleted({ isError: false, result: response.data.result }) : null;
      return;
    }
    onCompleted ? onCompleted({ isError: true, ...response.data }) : null;
  } catch (error) {
    onCompleted ? onCompleted({ isError: true, ...error }) : null;
  }
}
