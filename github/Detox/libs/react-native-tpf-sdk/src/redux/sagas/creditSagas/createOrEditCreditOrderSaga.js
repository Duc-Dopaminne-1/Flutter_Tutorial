import { call, put, select } from 'redux-saga/effects';
import {
  apiCreateFinanceDealOrderStepOne,
  apiCreateFinanceDealOrderStepThree,
  apiCreateFinanceDealOrderStepTwo,
  apiEditDeal
} from '../../../services/api/credit';
import {
  createFinaneDealOrderFailure,
  createFinaneDealOrderSuccess,
  editDealFailure,
  editDealSuccess
} from '../../actions/credit';
import { partnerItemSelector } from '../../selectors/partner';

export function* createFinanceDealOrderSaga(obj) {
  try {
    const { form, action, step } = obj.payload;
    const params = {
      ...form
    };
    let data = null;
    switch (step) {
      case 1:
        data = yield call(apiCreateFinanceDealOrderStepOne, params);
        break;

      case 2:
        data = yield call(apiCreateFinanceDealOrderStepTwo, params);
        break;

      case 3:
        data = yield call(apiCreateFinanceDealOrderStepThree, params);
        break;
      default:
        break;
    }

    if (data?.status === 200) {
      const partner = yield select(state =>
        partnerItemSelector(state, data?.data?.result?.partnerId)
      );
      yield put(
        createFinaneDealOrderSuccess({
          resultForm: {
            ...data?.data?.result,
            partnerName: partner?.name,
            partnerImage: partner?.imageLink
          },
          action,
          step
        })
      );
    } else {
      yield put(createFinaneDealOrderFailure({ ...data.response }));
    }
  } catch (error) {
    yield put(createFinaneDealOrderFailure(error));
  }
}

export function* editDealSaga(obj) {
  try {
    const { form, action, step } = obj.payload;
    const params = {
      ...form
    };
    const data = yield call(apiEditDeal, params);
    if (data.status === 200) {
      const partner = yield select(state =>
        partnerItemSelector(state, data.data?.result?.partnerId)
      );
      yield put(
        editDealSuccess({
          resultForm: {
            ...data.data.result,
            partnerName: partner?.name,
            partnerImage: partner?.imageLink
          },
          action,
          step
        })
      );
    } else {
      yield put(editDealFailure({ ...data.response }));
    }
  } catch (error) {
    yield put(editDealFailure(error));
  }
}
