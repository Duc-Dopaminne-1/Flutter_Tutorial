import { INSURANCE } from '../actionsType';

export const setLeadContactForInsurance = payload => ({
  type: INSURANCE.SET_LEAD_CONTACT.SUCCESS,
  payload
});

export const clearLeadContactForInsurance = payload => ({
  type: INSURANCE.SET_LEAD_CONTACT.CLEAR,
  payload
});

/**
 * Insurance Categories Actions
 * @param {Object} payload parameters
 * @returns
 */
export const getInsuranceCategoriesHandle = payload => ({
  type: INSURANCE.GET_INSURANCE_CATEGORIES.HANDLER,
  payload
});

export const getInsuranceCategoriesSuccess = payload => ({
  type: INSURANCE.GET_INSURANCE_CATEGORIES.SUCCESS,
  payload
});

export const getInsuranceCategoriesFailure = payload => ({
  type: INSURANCE.GET_INSURANCE_CATEGORIES.FAILURE,
  payload
});

export const clearInsuranceCategories = () => ({
  type: INSURANCE.GET_INSURANCE_CATEGORIES.CLEAR
});

/**
 * Insurance Products By Category Actions
 * @param {Object} payload parameters
 * @returns
 */
export const getInsuranceByCategoryHandle = payload => ({
  type: INSURANCE.GET_INSURANCE_BY_CATEGORY.HANDLER,
  payload
});

export const getInsuranceByCategorySuccess = payload => ({
  type: INSURANCE.GET_INSURANCE_BY_CATEGORY.SUCCESS,
  payload
});

export const getInsuranceByCategoryFailure = payload => ({
  type: INSURANCE.GET_INSURANCE_BY_CATEGORY.FAILURE,
  payload
});

export const clearInsuranceByCategory = payload => ({
  type: INSURANCE.GET_INSURANCE_BY_CATEGORY.CLEAR,
  payload
});

/**
 * Get Insurance Responses Actions
 * @param {Object} payload parameters
 * @returns
 */
export const getListInsuranceResponsesHandle = payload => ({
  type: INSURANCE.GET_LIST_RESPONSES.HANDLER,
  payload
});

export const getListInsuranceResponsesSuccess = payload => ({
  type: INSURANCE.GET_LIST_RESPONSES.SUCCESS,
  payload
});

export const getListInsuranceResponsesFailure = payload => ({
  type: INSURANCE.GET_LIST_RESPONSES.FAILURE,
  payload
});

export const getListInsuranceResponsesClear = payload => ({
  type: INSURANCE.GET_LIST_RESPONSES.CLEAR,
  payload
});

/**
 * Highlight Insurance Products Actions
 * @param {Object} payload parameters
 * @returns
 */
export const getHighlightInsuranceCategoriesHandle = payload => ({
  type: INSURANCE.GET_HIGHLIGHT_INSURANCE_CATEGORIES.HANDLER,
  payload
});

export const getHighlightInsuranceCategoriesSuccess = payload => ({
  type: INSURANCE.GET_HIGHLIGHT_INSURANCE_CATEGORIES.SUCCESS,
  payload
});

export const getHighlightInsuranceCategoriesFailure = payload => ({
  type: INSURANCE.GET_HIGHLIGHT_INSURANCE_CATEGORIES.FAILURE,
  payload
});

export const clearHighlightInsuranceCategories = () => ({
  type: INSURANCE.GET_HIGHLIGHT_INSURANCE_CATEGORIES.CLEAR
});

/**
 * Insurance Product Detail Actions
 * @param {Object} payload parameters
 * @returns
 */
export const getInsuranceDetailHandle = payload => ({
  type: INSURANCE.GET_INSURANCE_DETAIL.HANDLER,
  payload
});

export const getInsuranceDetailSuccess = payload => ({
  type: INSURANCE.GET_INSURANCE_DETAIL.SUCCESS,
  payload
});

export const getInsuranceDetailFailure = payload => ({
  type: INSURANCE.GET_INSURANCE_DETAIL.FAILURE,
  payload
});

export const clearInsuranceDetail = () => ({
  type: INSURANCE.GET_INSURANCE_DETAIL.CLEAR
});

/**
 * Insurance Order Form Actions
 * @param {Object} payload parameters
 * @returns
 */
export const getInsuranceOrderFormHandle = payload => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM.HANDLER,
  payload
});

export const getInsuranceOrderFormSuccess = payload => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM.SUCCESS,
  payload
});

export const getInsuranceOrderFormFailure = payload => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM.FAILURE,
  payload
});

export const clearInsuranceOrderForm = () => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM.CLEAR
});

export const clearInsuranceOrderResult = () => ({
  type: INSURANCE.CREATE_INSURANCE_ORDER.CLEAR
});

export const getInsuranceRefundConfigHandler = payload => ({
  type: INSURANCE.GET_INSUARANCE_REFUND_CONFIG.HANDLER,
  payload
});

export const getInsuranceRefundConfigSuccess = payload => ({
  type: INSURANCE.GET_INSUARANCE_REFUND_CONFIG.SUCCESS,
  payload
});

export const getInsuranceRefundConfigFailure = payload => ({
  type: INSURANCE.GET_INSUARANCE_REFUND_CONFIG.FAILURE,
  payload
});

export const createInsurancePaymentTransactionHandle = payload => ({
  type: INSURANCE.CREATE_INSURANCE_PAYMENT_TRANSACTION.HANDLER,
  payload
});

/**
 * Create Insurance Order Actions
 * @param {Object} payload parameters
 * @returns
 */
export const createInsuranceOrderHandle = payload => ({
  type: INSURANCE.CREATE_INSURANCE_ORDER.HANDLER,
  payload
});

export const createInsuranceOrderSuccess = payload => ({
  type: INSURANCE.CREATE_INSURANCE_ORDER.SUCCESS,
  payload
});

export const createInsuranceOrderFailure = payload => ({
  type: INSURANCE.CREATE_INSURANCE_ORDER.FAILURE,
  payload
});

/**
 * Edit Insurance Order Actions
 * @param {Object} payload parameters
 * @returns
 */
export const editInsuranceOrderHandle = payload => ({
  type: INSURANCE.EDIT_INSURANCE_ORDER.HANDLER,
  payload
});

export const editInsuranceOrderSuccess = payload => ({
  type: INSURANCE.EDIT_INSURANCE_ORDER.SUCCESS,
  payload
});

export const editInsuranceOrderFailure = payload => ({
  type: INSURANCE.EDIT_INSURANCE_ORDER.FAILURE,
  payload
});

/**
 * Insurance Order Form Create Actions
 * @param {Object} payload parameters
 * @returns
 */
export const getInsuranceOrderFormForCreateHandle = payload => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_CREATE.HANDLER,
  payload
});

export const getInsuranceOrderFormForCreateSuccess = payload => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_CREATE.SUCCESS,
  payload
});

export const getInsuranceOrderFormForCreateFailure = payload => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_CREATE.FAILURE,
  payload
});

export const getInsuranceOrderForCreateFormClear = () => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_CREATE.CLEAR
});

/**
 * Insurance Order Form Edit Actions
 * @param {Object} payload parameters
 * @returns
 */
export const getInsuranceOrderFormForEditHandle = payload => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_EDIT.HANDLER,
  payload
});

export const getInsuranceOrderFormForEditSuccess = payload => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_EDIT.SUCCESS,
  payload
});

export const getInsuranceOrderFormForEditFailure = payload => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_EDIT.FAILURE,
  payload
});

export const getInsuranceOrderForEditFormClear = () => ({
  type: INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_CREATE.CLEAR
});
