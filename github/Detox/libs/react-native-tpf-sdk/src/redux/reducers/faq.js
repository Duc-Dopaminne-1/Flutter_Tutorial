import { FAQ } from '../actionsType';

const initialState = {
  faqList: null,
  faqDetailList: null,
  faqDetailListLoading: null,
  faqDetailListPage: 0,
  createFAQSupportLoading: false,
  faqProcessingSupportList: [],
  faqProcessingSupportListCount: 0,
  faqProcessingSupportListPage: 0,
  faqProcessingSupportListLoading: null,
  faqWaitingSupportList: [],
  faqWaitingSupportListCount: 0,
  faqWaitingSupportListPage: 0,
  faqWaitingSupportListLoading: null,
  faqClosedSupportList: [],
  faqClosedSupportListCount: 0,
  faqClosedSupportListPage: 0,
  faqClosedSupportListLoading: null,
  faqSupportDetail: null
};

const faq = (state = initialState, action) => {
  switch (action.type) {
    case FAQ.GET_FAQ_SUPPORT_DETAIL.SUCCESS: {
      return {
        ...state,
        faqSupportDetail: action.payload
      };
    }
    /* Get list handler */
    case FAQ.GET_PROCESSING_FAQ_SUPPORT_LIST.HANDLER: {
      return {
        ...state,
        faqProcessingSupportListLoading: true
      };
    }
    case FAQ.GET_PROCESSING_FAQ_SUPPORT_LIST.SUCCESS: {
      const list = action.payload.items || [];

      if ([...list].length === 0) {
        return {
          ...state,
          faqProcessingSupportListLoading: null
        };
      }

      if (state.faqProcessingSupportList.length !== 0) {
        const newData = [...state.faqProcessingSupportList, ...list];
        return {
          ...state,
          faqProcessingSupportListLoading: false,
          faqProcessingSupportList: newData,
          faqProcessingSupportListPage: state.faqProcessingSupportListPage + 1,
          faqProcessingSupportListCount: action.payload.totalCount
        };
      }

      return {
        ...state,
        faqProcessingSupportListLoading: false,
        faqProcessingSupportList: [...list],
        faqProcessingSupportListPage: state.faqProcessingSupportListPage + 1,
        faqProcessingSupportListCount: action.payload.totalCount
      };
    }
    case FAQ.GET_PROCESSING_FAQ_SUPPORT_LIST.FAILURE: {
      return {
        ...state,
        faqProcessingSupportListLoading: false
      };
    }
    case FAQ.GET_PROCESSING_FAQ_SUPPORT_LIST.CLEAR: {
      return {
        ...state,
        faqProcessingSupportList: [],
        faqProcessingSupportListPage: 0
      };
    }
    /* Get list handler */
    /* Get list handler */
    case FAQ.GET_WAITING_FAQ_SUPPORT_LIST.HANDLER: {
      return {
        ...state,
        faqWaitingSupportListLoading: true
      };
    }
    case FAQ.GET_WAITING_FAQ_SUPPORT_LIST.SUCCESS: {
      const list = action.payload.items || [];

      if ([...list].length === 0) {
        return {
          ...state,
          faqWaitingSupportListLoading: null
        };
      }

      if (state.faqWaitingSupportList.length !== 0) {
        const newData = [...state.faqWaitingSupportList, ...list];
        return {
          ...state,
          faqWaitingSupportListLoading: false,
          faqWaitingSupportList: newData,
          faqWaitingSupportListPage: state.faqWaitingSupportListPage + 1,
          faqWaitingSupportListCount: action.payload.totalCount
        };
      }

      return {
        ...state,
        faqWaitingSupportListLoading: false,
        faqWaitingSupportList: [...list],
        faqWaitingSupportListPage: state.faqWaitingSupportListPage + 1,
        faqWaitingSupportListCount: action.payload.totalCount
      };
    }
    case FAQ.GET_WAITING_FAQ_SUPPORT_LIST.FAILURE: {
      return {
        ...state,
        faqWaitingSupportListLoading: false
      };
    }
    case FAQ.GET_WAITING_FAQ_SUPPORT_LIST.CLEAR: {
      return {
        ...state,
        faqWaitingSupportList: [],
        faqWaitingSupportListPage: 0
      };
    }
    /* Get list handler */
    /* Get list handler */
    case FAQ.GET_CLOSED_FAQ_SUPPORT_LIST.HANDLER: {
      return {
        ...state,
        faqClosedSupportListLoading: true
      };
    }
    case FAQ.GET_CLOSED_FAQ_SUPPORT_LIST.SUCCESS: {
      const list = action.payload.items || [];

      if ([...list].length === 0) {
        return {
          ...state,
          faqClosedSupportListLoading: null
        };
      }

      if (state.faqClosedSupportList.length !== 0) {
        const newData = [...state.faqClosedSupportList, ...list];
        return {
          ...state,
          faqClosedSupportListLoading: false,
          faqClosedSupportList: newData,
          faqClosedSupportListPage: state.faqClosedSupportListPage + 1,
          faqClosedSupportListCount: action.payload.totalCount
        };
      }

      return {
        ...state,
        faqClosedSupportListLoading: false,
        faqClosedSupportList: [...list],
        faqClosedSupportListPage: state.faqClosedSupportListPage + 1,
        faqClosedSupportListCount: action.payload.totalCount
      };
    }
    case FAQ.GET_CLOSED_FAQ_SUPPORT_LIST.FAILURE: {
      return {
        ...state,
        faqClosedSupportListLoading: false
      };
    }
    case FAQ.GET_CLOSED_FAQ_SUPPORT_LIST.CLEAR: {
      return {
        ...state,
        faqClosedSupportList: [],
        faqClosedSupportListPage: 0
      };
    }
    /* Get list handler */
    case FAQ.CREATE_FAQ_SUPPORT.HANDLER: {
      return {
        ...state,
        createFAQSupportLoading: true
      };
    }
    case FAQ.CREATE_FAQ_SUPPORT.SUCCESS: {
      return {
        ...state,
        createFAQSupportLoading: false
      };
    }
    case FAQ.CREATE_FAQ_SUPPORT.FAILURE: {
      return {
        ...state,
        createFAQSupportLoading: false
      };
    }
    case FAQ.GET_FAQ_DETAILS_LIST.HANDLER: {
      return {
        ...state,
        faqDetailListLoading: true
      };
    }

    case FAQ.GET_FAQ_DETAILS_LIST.SUCCESS: {
      const list = action.payload.items || [];
      if ([...list].length === 0) {
        return {
          ...state,
          faqDetailListLoading: null
        };
      }

      if (state.faqDetailList) {
        const newData = [...state.faqDetailList, ...list];
        return {
          ...state,
          faqDetailListLoading: false,
          faqDetailList: newData,
          faqDetailListPage: state.faqDetailListPage + 1
        };
      }

      return {
        ...state,
        faqDetailListLoading: false,
        faqDetailList: [...list],
        faqDetailListPage: state.faqDetailListPage + 1
      };
    }

    case FAQ.GET_FAQ_DETAILS_LIST.END: {
      return {
        ...state,
        faqDetailListLoading: false
      };
    }

    case FAQ.GET_FAQ_DETAILS_LIST.CLEAR: {
      return {
        ...state,
        faqDetailList: null,
        faqDetailListPage: 0
      };
    }

    case FAQ.GET_FAQ_DETAILS_LIST.FAILURE: {
      return {
        ...state,
        faqDetailListLoading: false
      };
    }

    case FAQ.GET_FAQ_LIST.SUCCESS: {
      const list = action.payload.items || [];

      if (state.faqList) {
        return {
          ...state,
          faqList: [...list]
        };
      }

      return {
        ...state,
        faqList: [...list]
      };
    }

    /* Get list summary */
    case FAQ.GET_FAQ_SUPPORT_LIST_SUMMARY.HANDLER: {
      return {
        ...state
      };
    }
    case FAQ.GET_FAQ_SUPPORT_LIST_SUMMARY.SUCCESS: {
      const { totalProcessing, totalWaiting, totalClosed, totalResponsed } =
        action.payload.data.result || [];

      return {
        ...state,
        faqProcessingSupportListCount: +totalProcessing + (totalResponsed || 0),
        faqWaitingSupportListCount: totalWaiting,
        faqClosedSupportListCount: totalClosed
      };
    }
    case FAQ.GET_FAQ_SUPPORT_LIST_SUMMARY.FAILURE: {
      return {
        ...state
      };
    }

    default:
      return state;
  }
};

export default faq;
