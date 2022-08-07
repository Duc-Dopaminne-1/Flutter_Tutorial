import { call, put, takeLatest } from 'redux-saga/effects';
import {
  ActionTypes,
  ActionCreateCard,
  ActionDeleteCard,
  ActionGetAllPayment,
  ActionSetPaymentDefault,
  ActionUpdateCard,
  ActionSetReceivedDefault,
  ActionUpdatePaypal,
  ActionGetStatusPayment,
  ActionGetTransactionsInfo,
} from './index';
import * as PaymentServices from './service';
import { saveAllPayment } from '@/redux/payment/actions';
import { getAllPayment as getAllPaymentAction } from '@/redux/payment/actions';
import { getUser } from '@/redux/user/actions';
import { RulePayment } from '@/constants/app';

function* getStatusPayment(action: ActionGetStatusPayment) {
  const { onSuccess, onFail, transactionId } = action.payload;
  try {
    const { error, result } = yield call(PaymentServices.getStatusPayment, { transactionId });
    if (!error && result) {
      onSuccess(result);
      yield put(getUser({}));
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* getAllPayment(action: ActionGetAllPayment) {
  const { onFail } = action.payload;
  try {
    const { error, result } = yield call(PaymentServices.getAllPayment);
    if (!error && result) {
      const payments = result.items.map(item => {
        if (item.type === RulePayment.PayPal) {
          item.cardType = 'Paypal';
        }
        return item;
      });

      yield put(saveAllPayment(payments));
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* createCard(action: ActionCreateCard) {
  const { onSuccess, onFail, paymentMethodId, email } = action.payload;
  try {
    const param = email ? { email } : { paymentMethodId };
    const { error, result } = yield call(PaymentServices.createCard, param);
    if (!error && result) {
      yield put(getUser({}));
      yield put(getAllPaymentAction({}));
      onSuccess && onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* setPaymentDefault(action: ActionSetPaymentDefault) {
  const { onFail, id } = action.payload;
  try {
    const { error, result } = yield call(PaymentServices.setPaymentDefault, { id });
    if (!error && result) {
      yield put(getUser({}));
      yield put(getAllPaymentAction({}));
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* setReceivedDefault(action: ActionSetReceivedDefault) {
  const { onFail, id } = action.payload;
  try {
    const { error, result } = yield call(PaymentServices.setReceivedDefault, { id });
    if (!error && result) {
      yield put(getUser({}));
      yield put(getAllPaymentAction({}));
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* deleteCard(action: ActionDeleteCard) {
  const { onSuccess, onFail, id } = action.payload;
  try {
    const { error, result } = yield call(PaymentServices.deleteCard, { id });
    if (!error && result) {
      // yield put(getUser({}));
      yield put(getAllPaymentAction({}));
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* updateCard(action: ActionUpdateCard) {
  const { onSuccess, onFail, id, expirationMonth, expirationYear, cardholderName } = action.payload;
  try {
    const { error, result } = yield call(PaymentServices.updateCard, { id, expirationMonth, expirationYear, cardholderName });
    if (!error && result) {
      // yield put(getUser({}));
      yield put(getAllPaymentAction({}));
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* getClientSecret(action: ActionUpdateCard) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(PaymentServices.getClientSecret);
    if (!error && result) {
      onSuccess && onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* updatePaypal(action: ActionUpdatePaypal) {
  const { onSuccess, onFail, id, email } = action.payload;
  try {
    const { error, result } = yield call(PaymentServices.updatePaypal, { id, email });
    if (!error && result) {
      yield put(getAllPaymentAction({}));
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* getTransactionsRequired(action: ActionUpdatePaypal) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(PaymentServices.getTransactionsRequired);
    if (!error && result) {
      onSuccess && onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* getTransactionsInfo(action: ActionGetTransactionsInfo) {
  const { onSuccess, onFail, id, isFromAuctionDetail } = action.payload;
  try {
    const { error, result } = yield call(PaymentServices.getTransactionsInfo, { id, isFromAuctionDetail });
    if (!error && result) {
      onSuccess && onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* authSaga() {
  yield takeLatest(ActionTypes.GET_STATUS_PAYMENT, getStatusPayment);
  yield takeLatest(ActionTypes.CREATE_CARD, createCard);
  yield takeLatest(ActionTypes.GET_ALL_PAYMENT, getAllPayment);
  yield takeLatest(ActionTypes.SET_PAYMENT_DEFAULT, setPaymentDefault);
  yield takeLatest(ActionTypes.SET_RECEIVED_DEFAULT, setReceivedDefault);
  yield takeLatest(ActionTypes.DELETE_CARD, deleteCard);
  yield takeLatest(ActionTypes.UPDATE_CARD, updateCard);
  yield takeLatest(ActionTypes.UPDATE_PAYPAL, updatePaypal);
  yield takeLatest(ActionTypes.GET_CLIENT_SECRET, getClientSecret);
  yield takeLatest(ActionTypes.GET_TRANSACTION_REQUIRE, getTransactionsRequired);
  yield takeLatest(ActionTypes.GET_TRANSACTION_INFO, getTransactionsInfo);
}

export default authSaga;
