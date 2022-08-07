import { Payment } from '@/services/payment';
import {
  ActionCreateCardPayload,
  ActionDeleteCardPayload,
  ActionGetStatusPaymentPayload,
  ActionGetTransactionsInfoPayload,
  ActionSetPaymentDefaultPayload,
  ActionSetReceivedDefaultPayload,
  ActionUpdateCardPayload,
  ActionUpdatePaypalPayload,
} from '@/redux/payment/index';

export const getStatusPayment = async (param: ActionGetStatusPaymentPayload) => {
  try {
    const response = await Payment.getStatusPayment(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getAllPayment = async () => {
  try {
    const response = await Payment.getAllPayment();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const createCard = async (param: ActionCreateCardPayload) => {
  try {
    const response = await Payment.createCard(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const setPaymentDefault = async (param: ActionSetPaymentDefaultPayload) => {
  try {
    const response = await Payment.setPaymentDefault(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const setReceivedDefault = async (param: ActionSetReceivedDefaultPayload) => {
  try {
    const response = await Payment.setReceivedDefault(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const deleteCard = async (param: ActionDeleteCardPayload) => {
  try {
    const response = await Payment.deleteCard(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const updateCard = async (param: ActionUpdateCardPayload) => {
  try {
    const response = await Payment.updateCard(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getClientSecret = async () => {
  try {
    const response = await Payment.getClientSecret();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const updatePaypal = async (param: ActionUpdatePaypalPayload) => {
  try {
    const response = await Payment.updatePaypal(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getTransactionsRequired = async () => {
  try {
    const response = await Payment.getTransactionsRequired();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getTransactionsInfo = async (param: ActionGetTransactionsInfoPayload) => {
  try {
    const response = await Payment.getTransactionsInfo(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
