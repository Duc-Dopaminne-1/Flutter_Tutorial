import { ORDER } from '../../actionsType';
import { takeLatest, takeLeading } from 'redux-saga/effects';
import { deleteOrderSaga } from './deleteOrderSaga';
import { getOrderDetailSaga } from './getOrderDetailSaga';
import { getOrderListSaga } from './getOrderListSaga';
import { getOrderTotalRecordSaga } from './getOrderTotalRecordSaga';
import { setOrderNewFlagSaga } from './setOrderNewFlagSaga';
import { updateOrderStatusSaga } from './updateOrderStatusSaga';

export default function* contactSagas() {
  yield takeLatest(ORDER.GET_ORDER_LIST.HANDLER, getOrderListSaga);
  yield takeLatest(ORDER.GET_ORDER_DETAIL.HANDLER, getOrderDetailSaga);
  yield takeLatest(ORDER.UPDATE_ORDER_STATUS.HANDLER, updateOrderStatusSaga);
  yield takeLatest(ORDER.GET_TOTAL_RECORD.HANDLER, getOrderTotalRecordSaga);
  yield takeLatest(ORDER.SET_ORDER_NEW_FLAG.HANDLER, setOrderNewFlagSaga);
  yield takeLeading(ORDER.DELETE_ORDER.HANDLER, deleteOrderSaga);
}
