import {
  ActionTypes,
  ActionCreateCard,
  ActionCreateCardPayload,
  ActionDeleteCard,
  ActionDeleteCardPayload,
  ActionGetAllPayment,
  ActionGetClientToken,
  ActionSaveAllPayment,
  ActionSaveAllPaymentPayload,
  ActionSetPaymentDefault,
  ActionSetPaymentDefaultPayload,
  ActionUpdateCard,
  ActionUpdateCardPayload,
  ActionSetReceivedDefault,
  ActionSetReceivedDefaultPayload,
  ActionGetClientSecret,
  ActionUpdatePaypal,
  ActionUpdatePaypalPayload,
  ActionGetStatusPayment,
  ActionGetStatusPaymentPayload,
  ActionGetTransactionsRequired,
  ActionGetTransactionsInfo,
  ActionGetTransactionsInfoPayload,
} from './index';
import { ActionCallback } from '@/redux/auth';

export function getClientToken(payload: ActionCallback): ActionGetClientToken {
  return {
    type: ActionTypes.GET_CLIENT_TOKEN,
    payload,
  };
}

export function createCard(payload: ActionCreateCardPayload): ActionCreateCard {
  return {
    type: ActionTypes.CREATE_CARD,
    payload,
  };
}

export function updatePaypal(payload: ActionUpdatePaypalPayload): ActionUpdatePaypal {
  return {
    type: ActionTypes.UPDATE_PAYPAL,
    payload,
  };
}

export function getAllPayment(payload: ActionCallback): ActionGetAllPayment {
  return {
    type: ActionTypes.GET_ALL_PAYMENT,
    payload,
  };
}

export function saveAllPayment(payload: ActionSaveAllPaymentPayload): ActionSaveAllPayment {
  return {
    type: ActionTypes.SAVE_ALL_PAYMENT,
    payload,
  };
}

export function setPaymentDefault(payload: ActionSetPaymentDefaultPayload): ActionSetPaymentDefault {
  return {
    type: ActionTypes.SET_PAYMENT_DEFAULT,
    payload,
  };
}

export function setReceivedDefault(payload: ActionSetReceivedDefaultPayload): ActionSetReceivedDefault {
  return {
    type: ActionTypes.SET_RECEIVED_DEFAULT,
    payload,
  };
}

export function deleteCard(payload: ActionDeleteCardPayload): ActionDeleteCard {
  return {
    type: ActionTypes.DELETE_CARD,
    payload,
  };
}

export function updateCard(payload: ActionUpdateCardPayload): ActionUpdateCard {
  return {
    type: ActionTypes.UPDATE_CARD,
    payload,
  };
}

export function getClientSecret(payload: ActionCallback): ActionGetClientSecret {
  return {
    type: ActionTypes.GET_CLIENT_SECRET,
    payload,
  };
}

export function getStatusPayment(payload: ActionGetStatusPaymentPayload): ActionGetStatusPayment {
  return {
    type: ActionTypes.GET_STATUS_PAYMENT,
    payload,
  };
}

export function getTransactionsRequired(payload: ActionCallback): ActionGetTransactionsRequired {
  return {
    type: ActionTypes.GET_TRANSACTION_REQUIRE,
    payload,
  };
}

export function getTransactionsInfo(payload: ActionGetTransactionsInfoPayload): ActionGetTransactionsInfo {
  return {
    type: ActionTypes.GET_TRANSACTION_INFO,
    payload,
  };
}
