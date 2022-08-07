import { call } from 'redux-saga/effects';
import { apiUploadFileWithDetail } from '../../../services/api/fileStorage';

export function* uploadFileSaga(obj) {
  const { uri, type, name, size, onCompleted } = obj.payload;
  try {
    const formData = new FormData();
    formData.append('fileStream', {
      uri: uri,
      name: name,
      type: type,
      size: size
    });

    const response = yield call(apiUploadFileWithDetail, formData);
    if (response.status === 200) {
      onCompleted ? onCompleted({ isError: false, result: response.data.result }) : null;
      return;
    }
    onCompleted ? onCompleted({ isError: true, ...response.data }) : null;
  } catch (error) {
    onCompleted ? onCompleted({ isError: true, ...error }) : null;
  }
}
