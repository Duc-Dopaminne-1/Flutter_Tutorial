import { put } from 'redux-saga/effects';
import { getOfferDetailFailure, getOfferDetailSuccess } from '../../actions/offer';

export function* getOfferDetailSaga(payload) {
  try {
    const params = { ...payload };
    // const data = yield call('', params);
    const data = {
      data: {
        status: 200,
        result: {
          id: 1,
          imageUrl:
            'https://www.b247.com.vn/wp-content/uploads/2019/11/kham-pha-bi-mat-ve-fintech-la-gi-danh-cho-nhung-ai-dang-tim-hieu-tai-day-01.jpg',
          title: 'Hưng Thịnh hợp tác cùng Akachain',
          description:
            'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
          time: '15:00 - 17:00 - 15/05/2020'
        }
      }
    };

    if (data.status === 200) {
      yield put(
        getOfferDetailSuccess({
          item: data.data.result
        })
      );
    } else {
      yield put(getOfferDetailFailure(data));
    }
  } catch (error) {
    yield put(getOfferDetailFailure(error));
  }
}
