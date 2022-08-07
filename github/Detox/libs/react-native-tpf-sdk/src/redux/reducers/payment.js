import { PAYMENT } from '../actionsType';

const initialState = {
  generateLinkResult: null,
  responsePaymentData: null
};

const payment = (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT.GENERATE_LINK.SUCCESS: {
      return {
        ...state,
        generateLinkResult: action.payload.item
      };
    }

    case PAYMENT.CLEAR_LINK.CLEAR: {
      return {
        ...state,
        generateLinkResult: null
      };
    }

    case PAYMENT.GET_RESPONSE_PAYMENT_DATA.SUCCESS: {
      return {
        ...state,
        responsePaymentData: action.payload.item
      };
    }

    case PAYMENT.CLEAR_RESPONSE_PAYMENT_DATA.CLEAR: {
      return {
        ...state,
        responsePaymentData: null
      };
    }
    case PAYMENT.GET_PAYMENT_RESULT.SUCCESS: {
      return {
        ...state,
        paymentResult: { ...action.payload }
      };
    }

    case PAYMENT.GET_PAYMENT_RESULT.CLEAR: {
      return {
        ...state,
        paymentResult: null
      };
    }

    default:
      return state;
  }
};

export default payment;
