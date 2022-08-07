import { getAllInvoiceFailure, getAllInvoiceSuccess } from '../../actions/invoice';
import { call, put } from 'redux-saga/effects';
import { apiGetAllInvoice, apiGetSubscriptionTransaction } from '../../../services/api/invoiceApi';

export function* getAllInvoiceSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(
      params.type !== 4 ? apiGetAllInvoice : apiGetSubscriptionTransaction,
      params
    );

    if (data.status === 200) {
      yield put(
        getAllInvoiceSuccess({
          ...data.data.result,
          loadMore: params.skipCount > 0
        })
      );
    } else {
      yield put(getAllInvoiceFailure(data));
    }
  } catch (error) {
    yield put(getAllInvoiceFailure(error));
  }
}
