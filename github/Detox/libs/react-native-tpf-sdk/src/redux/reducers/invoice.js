import { INVOICE } from '../actionsType';

const initialState = {
  createOrEditInvoiceResult: {},
  invoiceList: [],
  invoiceTotalCount: 0,
  invoiceLoading: false,
  transactionList: [],
  transactionTotalCount: 0,
  transactionLoading: false,
  createUpgradeTopenerTransaction: {}
};

const invoice = (state = initialState, action) => {
  switch (action.type) {
    /**
     * Insurance Create Or Edit Order Form
     */

    case INVOICE.CREATE_OR_EDIT_INVOICE.SUCCESS:
      return {
        ...state,
        createOrEditInvoiceResult: action.payload
      };

    case INVOICE.CREATE_OR_EDIT_INVOICE.FAILURE:
      return {
        ...state,
        createOrEditInvoiceResult: action.payload
      };

    case INVOICE.CREATE_OR_EDIT_INVOICE.CLEAR:
      return {
        ...state,
        createOrEditInvoiceResult: null
      };

    case INVOICE.GET_ALL_INVOICE.HANDLER:
      return {
        ...state,
        invoiceLoading: true
      };

    case INVOICE.GET_ALL_INVOICE.SUCCESS: {
      const { items, totalCount, loadMore } = action.payload;
      const newData = loadMore ? [...state.invoiceList, ...items] : items;
      return {
        ...state,
        invoiceList: newData,
        invoiceTotalCount: totalCount,
        invoiceLoading: false
      };
    }
    case INVOICE.GET_ALL_INVOICE.FAILURE:
      return {
        ...state,
        invoiceLoading: false
      };

    case INVOICE.GET_ALL_INVOICE.CLEAR:
      return {
        ...state,
        invoiceList: [],
        invoiceTotalCount: 0
      };

    case INVOICE.GET_ALL_TRANSACTION.HANDLER:
      return {
        ...state,
        transactionLoading: true
      };

    case INVOICE.GET_ALL_TRANSACTION.SUCCESS: {
      const itemTransactions = action.payload.items;
      const transactionTotalCounts = action.payload.totalCount;
      const loadMoreTransactions = action.payload.loadMore;
      const newDataTransaction = loadMoreTransactions
        ? [...state.transactionList, ...itemTransactions]
        : itemTransactions;
      return {
        ...state,
        transactionList: newDataTransaction,
        transactionTotalCount: transactionTotalCounts,
        transactionLoading: false
      };
    }

    case INVOICE.GET_ALL_TRANSACTION.FAILURE:
      return {
        ...state,
        transactionLoading: false
      };

    case INVOICE.CREATE_UPGRADE_TOPENER_TRANSACTION.SUCCESS:
      return {
        ...state,
        createUpgradeTopenerTransaction: action.payload
      };

    case INVOICE.CREATE_UPGRADE_TOPENER_TRANSACTION.FAILURE:
      return {
        ...state,
        createUpgradeTopenerTransaction: action.payload
      };

    case INVOICE.CREATE_UPGRADE_TOPENER_TRANSACTION.CLEAR:
      return {
        ...state,
        createUpgradeTopenerTransaction: null
      };

    default:
      return state;
  }
};

export default invoice;
