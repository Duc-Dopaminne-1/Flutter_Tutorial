export const LIMIT_PAGE = 10;
export const CATEGORY_TYPE = {
  NEWS: 1,
  BANNER: 2,
  EVENT: 3,
  FAQ: 4,
  SALE_KIT: 5,
  POLICY: 6,
  TERM_AND_CONDITION: 7,
  PRIVACY: 16
};

export const PRODUCT_CATEGORY_TYPE = {
  CREDIT: 1,
  INSURANCE: 2,
  EXTRA_SERVICE: 3
};

export const ORDER_TYPE = {
  CREDIT: 'Credit',
  INSURANCE: 'Insurance',
  EXTRA_SERVICE: 'AddedServices'
};

export const MEMBER_REQUEST_TYPE = {
  REQUEST_JOIN_GROUP: 1,
  CANCEL_REQUEST_JOIN_GROUP: 2,
  CANCEL_REQUEST_LEAVE_GROUP: 3,
  REQUEST_LEAVE_GROUP: 4
};

export const LEADER_ACTION_TYPE = {
  REMOVE: 1,
  ACCEPT: 2,
  REJECT: 3,
  REJECT_TO_LEAVE: 4
};

export const TYPE_GROUP_TOPENER_REQUEST = {
  LIST_REQUEST: 1,
  LIST_MEMBER: 2
};

export const KPI_STATUS_PROGRESS = {
  PROGRESSING: 1,
  UPCOMING: 2,
  EXPRIRED: 3
};

export const SDK_EVENT_NAME = {
  CREDIT_APPLICATION_CREATE: 'credit_application_create',
  CREDIT_APPLICATION_UPDATE: 'credit_application_update',
  CREDIT_APPLICATION_REFUND: 'credit_application_refund',
  INSURRANCE_APPLICATION_CREATE: 'insurrance_application_create',
  INSURRANCE_APPLICATION_UPDATE: 'insurrance_application_update',
  EXTRA_SERVICE_APPLICATION_CREATE: 'extra_service_application_create',
  EXTRA_SERVICE_APPLICATION_UPDATE: 'extra_service_application_update',
  LEAD_CREATE: 'lead_create',
  LEAD_UPDATE: 'lead_update',
  LEAD_FAST_REQUEST_CREATE: 'lead_fast_request_create',
  LEAD_DELETE: 'lead_delete',
  SUPPORT_CREATE: 'support_create',
  SUPPORT_UPDATE: 'support_update'
};
