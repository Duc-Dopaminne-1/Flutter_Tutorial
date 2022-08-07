import { createOrEditInvoiceFailure, createOrEditInvoiceSuccess } from '../../actions/invoice';
import { call, put } from 'redux-saga/effects';
import { apiCreateOrEditInvoice } from '../../../services/api/invoiceApi';
import { getShowAlertError } from '../../../redux/actions/system';
import { SUBMIT_REQUEST_FAILURE } from '../../../constants/errors';

export function* createOrEditInvoiceSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiCreateOrEditInvoice, params);

    if (data.status === 200) {
      yield put(createOrEditInvoiceSuccess({ ...data.data.result, isSuccess: true }));
    } else {
      yield put(createOrEditInvoiceFailure(data));
      yield put(getShowAlertError({ ...SUBMIT_REQUEST_FAILURE, message: data?.message }));
    }
  } catch (error) {
    yield put(createOrEditInvoiceFailure(error));
  }
}
