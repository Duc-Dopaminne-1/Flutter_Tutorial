import { DEPOSIT } from '../actionsType';

const initialState = {
  createOrEditDepositResult: {},
  depositMoney: 0,
  expectedDepositRefundCompleted: 0,
  listRefundRequest: [],
  pendingTransactionCount: 0,
  paidTransactionCount: 0,
  pendingInsuranceCount: 0,
  paidInsuranceCount: 0,
  listLoading: false,
  isEndList: false,
  depositMethod: {}
};

const deposit = (state = initialState, action) => {
  switch (action.type) {
    case DEPOSIT.GET_SUMMARY_TRANSACTION.SUCCESS: {
      const { pendingTransactionCount, paidTransactionCount } = action.payload;

      return {
        ...state,
        pendingTransactionCount: pendingTransactionCount,
        paidTransactionCount: paidTransactionCount
      };
    }
    case DEPOSIT.GET_SUMMARY_INSURANCE.SUCCESS: {
      const { pendingInsuranceCount, paidInsuranceCount } = action.payload;

      return {
        ...state,
        pendingInsuranceCount: pendingInsuranceCount,
        paidInsuranceCount: paidInsuranceCount
      };
    }
    case DEPOSIT.GET_LIST_REFUND_REQUEST.HANDLER: {
      return {
        ...state,
        listLoading: true,
        isEndList: false
      };
    }
    case DEPOSIT.GET_LIST_REFUND_REQUEST.SUCCESS: {
      const { items, skipCount, isEndList } = action.payload;
      return {
        ...state,
        listLoading: false,
        listRefundRequest: skipCount > 0 ? [...state.listRefundRequest, ...items] : items,
        isEndList: isEndList
      };
    }
    case DEPOSIT.GET_LIST_REFUND_REQUEST.CLEAR: {
      return {
        ...state,
        listRefundRequest: []
      };
    }
    case DEPOSIT.GET_LIST_REFUND_REQUEST.FAILURE: {
      return {
        ...state,
        listLoading: false
      };
    }
    case DEPOSIT.GET_DEPOSIT_MONEY.SUCCESS: {
      const data = action.payload.rs || {};
      return {
        ...state,
        depositMoney: data.depositeValue,
        expectedDepositRefundCompleted: data.expectedDepositRefundCompleted,
        depositMethod: data.depositMethod
      };
    }

    default:
      return state;
  }
};

export default deposit;
