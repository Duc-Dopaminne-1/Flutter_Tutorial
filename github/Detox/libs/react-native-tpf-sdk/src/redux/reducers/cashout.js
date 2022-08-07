import { CASHOUT } from '../actionsType';

const initialState = {
  isSuccess: false,
  createTransaction: {},
  isSuccessDetail: false,
  transactionDetail: {},
  withdrawConfig: {},
  isSuccessAdvanceCommission: false,
  advanceTransaction: [],
  isLoadingAdvanceTransaction: false,
  isEndListAdvanceTransaction: false
};

const cashout = (state = initialState, action) => {
  switch (action.type) {
    case CASHOUT.GET_ADVANCE_TRANSACTION.HANDLER: {
      return {
        ...state,
        isLoadingAdvanceTransaction: true,
        isEndListAdvanceTransaction: false
      };
    }
    case CASHOUT.GET_ADVANCE_TRANSACTION.SUCCESS: {
      const { items, skipCount, isEndList } = action.payload;
      return {
        ...state,
        isLoadingAdvanceTransaction: false,
        isEndListAdvanceTransaction: isEndList,
        advanceTransaction: skipCount > 0 ? [...state.advanceTransaction, ...items] : items
      };
    }
    case CASHOUT.GET_ADVANCE_TRANSACTION.FAILURE: {
      return {
        ...state,
        isLoadingAdvanceTransaction: false
      };
    }
    case CASHOUT.CREATE_OR_EDIT_TRANSACTION.SUCCESS:
      return {
        ...state,
        isSuccess: action.payload.isSuccess,
        createTransaction: action.payload
      };
    case CASHOUT.CREATE_OR_EDIT_TRANSACTION.CLEAR:
      return {
        ...state,
        isSuccess: false
      };
    case CASHOUT.GET_TRANSACTION_BY_ID.SUCCESS:
      return {
        ...state,
        transactionDetail: action.payload,
        isSuccessDetail: action.payload.isSuccessDetail
      };
    case CASHOUT.GET_TRANSACTION_BY_ID.CLEAR:
      return {
        ...state,
        isSuccessDetail: false
      };

    case CASHOUT.GET_ALL_GLOBAL_CONFIG.SUCCESS:
      return {
        ...state,
        withdrawConfig: action.payload
      };

    case CASHOUT.CREATE_OR_EDIT_ADVANCE_COMMISSION.SUCCESS:
      return {
        ...state,
        isSuccessAdvanceCommission: action.payload.isSuccess
      };
    case CASHOUT.CREATE_OR_EDIT_ADVANCE_COMMISSION.CLEAR:
      return {
        ...state,
        isSuccessAdvanceCommission: false
      };

    default:
      return state;
  }
};

export default cashout;
