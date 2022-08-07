import { FAQ } from '../actionsType';

export const closeFAQRequestHandle = payload => ({
  type: FAQ.CLOSE_REQUEST.HANDLER,
  payload
});

export const closeFAQRequestSuccess = payload => ({
  type: FAQ.CLOSE_REQUEST.SUCCESS,
  payload
});

export const closeFAQRequestFailure = payload => ({
  type: FAQ.CLOSE_REQUEST.FAILURE,
  payload
});

export const feedbackToOperatorHandle = payload => ({
  type: FAQ.FEEDBACK_TO_OPERATOR.HANDLER,
  payload
});

export const feedbackToOperatorSuccess = payload => ({
  type: FAQ.FEEDBACK_TO_OPERATOR.SUCCESS,
  payload
});

export const feedbackToOperatorFailure = payload => ({
  type: FAQ.FEEDBACK_TO_OPERATOR.FAILURE,
  payload
});

export const getFAQSupportDetailHandle = payload => ({
  type: FAQ.GET_FAQ_SUPPORT_DETAIL.HANDLER,
  payload
});

export const getFAQSupportDetailSuccess = payload => ({
  type: FAQ.GET_FAQ_SUPPORT_DETAIL.SUCCESS,
  payload
});

export const getFAQSupportDetailFailure = payload => ({
  type: FAQ.GET_FAQ_SUPPORT_DETAIL.FAILURE,
  payload
});

export const getProcessingListFAQSupportHandle = payload => ({
  type: FAQ.GET_PROCESSING_FAQ_SUPPORT_LIST.HANDLER,
  payload
});

export const getProcessingListFAQSupportSuccess = payload => ({
  type: FAQ.GET_PROCESSING_FAQ_SUPPORT_LIST.SUCCESS,
  payload
});

export const getProcessingListFAQSupportFailure = payload => ({
  type: FAQ.GET_PROCESSING_FAQ_SUPPORT_LIST.FAILURE,
  payload
});

export const getProcessingListFAQSupportClear = payload => ({
  type: FAQ.GET_PROCESSING_FAQ_SUPPORT_LIST.CLEAR,
  payload
});

export const getWaitingListFAQSupportHandle = payload => ({
  type: FAQ.GET_WAITING_FAQ_SUPPORT_LIST.HANDLER,
  payload
});

export const getWaitingListFAQSupportSuccess = payload => ({
  type: FAQ.GET_WAITING_FAQ_SUPPORT_LIST.SUCCESS,
  payload
});

export const getWaitingListFAQSupportFailure = payload => ({
  type: FAQ.GET_WAITING_FAQ_SUPPORT_LIST.FAILURE,
  payload
});

export const getWaitingListFAQSupportClear = payload => ({
  type: FAQ.GET_WAITING_FAQ_SUPPORT_LIST.CLEAR,
  payload
});

export const getClosedListFAQSupportHandle = payload => ({
  type: FAQ.GET_CLOSED_FAQ_SUPPORT_LIST.HANDLER,
  payload
});

export const getClosedListFAQSupportSuccess = payload => ({
  type: FAQ.GET_CLOSED_FAQ_SUPPORT_LIST.SUCCESS,
  payload
});

export const getClosedListFAQSupportFailure = payload => ({
  type: FAQ.GET_CLOSED_FAQ_SUPPORT_LIST.FAILURE,
  payload
});

export const getClosedListFAQSupportClear = payload => ({
  type: FAQ.GET_CLOSED_FAQ_SUPPORT_LIST.CLEAR,
  payload
});

export const createFAQSupportHandler = payload => ({
  type: FAQ.CREATE_FAQ_SUPPORT.HANDLER,
  payload
});

export const createFAQSupportSuccess = payload => ({
  type: FAQ.CREATE_FAQ_SUPPORT.SUCCESS,
  payload
});

export const createFAQSupportFailure = payload => ({
  type: FAQ.CREATE_FAQ_SUPPORT.FAILURE,
  payload
});

export const getFAQListHandle = payload => ({
  type: FAQ.GET_FAQ_LIST.HANDLER,
  payload
});

export const getFAQListSuccess = payload => ({
  type: FAQ.GET_FAQ_LIST.SUCCESS,
  payload
});

export const getFAQListFailure = payload => ({
  type: FAQ.GET_FAQ_LIST.FAILURE,
  payload
});

export const getFAQDetailsListHandle = payload => ({
  type: FAQ.GET_FAQ_DETAILS_LIST.HANDLER,
  payload
});

export const getFAQDetailsListSuccess = payload => ({
  type: FAQ.GET_FAQ_DETAILS_LIST.SUCCESS,
  payload
});

export const getFAQDetailsListFailure = payload => ({
  type: FAQ.GET_FAQ_DETAILS_LIST.FAILURE,
  payload
});

export const getFAQDetailsListClear = payload => ({
  type: FAQ.GET_FAQ_DETAILS_LIST.CLEAR,
  payload
});

export const getFAQDetailsListEnd = payload => ({
  type: FAQ.GET_FAQ_DETAILS_LIST.END,
  payload
});

export const getFAQSupportSummaryHandle = payload => ({
  type: FAQ.GET_FAQ_SUPPORT_LIST_SUMMARY.HANDLER,
  payload
});

export const getFAQSupportSummarySuccess = payload => ({
  type: FAQ.GET_FAQ_SUPPORT_LIST_SUMMARY.SUCCESS,
  payload
});

export const getFAQSupportSummaryFailure = payload => ({
  type: FAQ.GET_FAQ_SUPPORT_LIST_SUMMARY.FAILURE,
  payload
});
