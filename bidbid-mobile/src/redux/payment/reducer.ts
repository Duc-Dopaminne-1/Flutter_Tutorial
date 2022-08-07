import { PaymentAction, ActionTypes, ActionSaveAllPaymentPayload } from './index';

export interface PaymentInit {
  payment: PaymentData;
}

export interface PaymentData {
  data: ActionSaveAllPaymentPayload[];
}

const initialState: PaymentData = {
  data: [],
};

const reducer = (state: PaymentData = initialState, action: PaymentAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_ALL_PAYMENT:
      return {
        ...state,
        data: action.payload,
      };
    case ActionTypes.LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
