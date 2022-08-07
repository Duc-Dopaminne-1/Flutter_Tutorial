import { call, put, all } from 'redux-saga/effects';
import { apiCreateSDKLead } from '../../../services/api/leadApi';
import { apiUploadFileWithDetail } from '../../../services/api/fileStorage';
import { getShowAlertError } from '../../actions/system';
import { SYSTEM_ERROR } from '../../../constants/errors';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';

export function* createRequestSaga(action) {
  const { memberId, fullName, phone, email, categories, images, callback, description } =
    action.payload;
  try {
    let uploadImage = [],
      new_images = [];
    images.forEach(item => {
      const { mime, size, sourceURL, filename } = item;
      const formData = new FormData();
      formData.append('fileStream', {
        uri: sourceURL,
        name: filename,
        type: mime,
        size: size
      });
      uploadImage.push(call(apiUploadFileWithDetail, formData));
    });
    const imageList = yield all(uploadImage);
    imageList.forEach(item => {
      if (item?.data?.success) {
        new_images.push(item.data.result);
      }
    });
    const demandTypes = categories.map(elem => elem.triggerName);
    const params = {
      memberId,
      fullName,
      phone,
      email,
      demandTypes,
      notes: description,
      images: new_images
    };
    const data = yield call(apiCreateSDKLead, params);
    if (data.status === 200) {
      const leadList = data?.data?.result?.leads || [];
      if (leadList?.length > 0) {
        leadList.forEach(lead => {
          emitEvent({ event_name: SDK_EVENT_NAME.LEAD_FAST_REQUEST_CREATE, data: lead });
        });
      }
      callback(true);
      return;
    }
    callback(false);
    yield put(getShowAlertError(SYSTEM_ERROR));
  } catch (error) {
    yield put(getShowAlertError(SYSTEM_ERROR));
    callback(false);
  }
}
