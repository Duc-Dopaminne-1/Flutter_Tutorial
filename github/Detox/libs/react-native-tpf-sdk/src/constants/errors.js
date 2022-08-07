import React from 'react';
import {
  ICCancel,
  ICDeleteProfile,
  ICFaceIDNotAuth,
  ICFingerPrintNotAuth,
  ICInfoConfirm,
  ICLeaveGroup,
  ICQuestionPopup,
  ICSad,
  ICSendConfirm,
  ICSuccessAlert,
  ICSupportRequire,
  ICTick
} from '../assets/icons';
import { require_login } from '../assets/images';

export const RESPONSE_CODE = {
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIME_OUT: 408,
  UNAUTHORIZED_STATUS: 401,
  REFETCH_FAILED: 'REFETCH_FAILED',
  NOT_INTERNET: 'NOT_INTERNET',
  UNDEFINED: 'UNDEFINED',
  UNKNOWN: 'UNKNOWN',
  // auth
  SUCCESS: 'SUCCESS',
  QRCODE_EXPIRES: 'QRCODE_EXPIRES',
  LOGIN_FAILED: 'LOGIN_FAILED',
  INVALID_PHONE_NUMBER: 'auth/invalid-phone-number',
  INVALID_USER_VERIFICATION_CODE: 'auth/invalid-verification-code',
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
  AUTH_UNKNOWN: 'auth/unknown',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  AUTH_SESSION_EXPIRED: 'auth/session-expired',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ALREADY_EXIST: 'ALREADY_EXIST',
  OVER_SEND: 'OVER_SEND',
  NOT_ENOUGH_TIME: 'NOT_ENOUGH_TIME',
  TIMES_OVER: 'TIMES_OVER',
  PARTNER_NOT_FOUND: 'PARTNER_NOT_FOUND',
  BRANCH_NOT_FOUND: 'BRANCH_NOT_FOUND',
  PARAM_INVALID: 'PARAM_INVALID',
  USER_NOT_FOUND_WITH_CODE: 'USER_NOT_FOUND_WITH_CODE',
  VOCABULARY_NOT_FOUND: 'VOCABULARY_NOT_FOUND',
  ALREADY_RATING: 'ALREADY_RATING',
  NOT_RATING: 'NOT_RATING',
  INSERT_FEEDBACK_FAILD: 'INSERT_FEEDBACK_FAILD',
  CLASS_NOT_FOUND: 'CLASS_NOT_FOUND',
  NEWS_NOT_FOUND: 'NEWS_NOT_FOUND',
  LOGIN_WITH_MOBILE_FAILED: 'LOGIN_WITH_MOBILE_FAILED',
  LOGIN_WITH_EMAIL_FAILED: 'LOGIN_WITH_EMAIL_FAILED',
  // coupon
  COUPON_NOT_FOUND: 'COUPON_NOT_FOUND',
  TALKS_POINT_NOT_ENOUGH: 'TALKS_POINT_NOT_ENOUGH',
  TEACHER_TIME_OUT_CONFIRM: 'TEACHER_TIME_OUT_CONFIRM',
  ALREADY_CONFIRM: 'ALREADY_CONFIRM',
  TEACHER_CONFIRM_FAILED: 'TEACHER_CONFIRM_FAILD',
  TEACHER_FEEDBACK_FAILED: 'TEACHER_FEEDBACK_FAILD',
  CLAIM_COUPON_FAILED: 'CLAIM_COUPON_FAILD'
};

export const GUEST_MESSAGE = {
  code: null,
  message: 'errMessage.please_login',
  canLogOut: true,
  button: true,
  whiteButton: true
};

export const EXPIRED_SESSION = {
  code: null,
  message: 'errMessage.session_error',
  canLogOut: true,
  button: true,
  whiteButton: false
};

export const LOGIN_MESSAGE = {
  code: null,
  message: 'errMessage.welcome_oldMember'
};

export const PENDING_ACCOUNT_MESSAGE = {
  code: null,
  message: 'auth.pendingAccount',
  closeButton: true
};

export const PINCODE_SUCCESS_MESSAGE = {
  code: 'success',
  message: 'auth.pinCode_success'
};

export const FACEID_SUCCESS_MESSAGE = {
  code: 'success',
  message: 'auth.faceID_success'
};

export const FINGER_SUCCESS_MESSAGE = {
  code: 'success',
  message: 'auth.finger_success'
};

export const FACEID_FAILED_MESSAGE = {
  code: 'failed-faceId',
  message: 'auth.faceID_success'
};

export const FINGER_FAILED_MESSAGE = {
  code: 'failed-finger',
  message: 'auth.finger_success'
};

export const REGISTER_MESSAGE = {
  code: null,
  message: 'errMessage.welcome_newMember'
};

export const LOGIN_SUCCESS_MESSAGE = {
  code: null,
  message: 'auth.login_success'
};

export const REGISTER_SUCCESS_MESSAGE = {
  code: 'success',
  message: 'auth.register_success'
};

export const QRCODE_ERROR_MESSAGE = {
  code: null,
  message: 'scan.please_check'
};

export const INPUT_SUCCESS_MESSAGE = {
  code: null,
  title: '',
  message: 'error_msg.input_success_message'
};

export const READ_NEW_SUCCESS_MESSAGE = {
  code: null,
  message: 'news.bonus'
};

export const TURN_OFF_PIN_CODE = {
  code: 'success',
  message: 'pinCode.turnOffPinCode'
};

export const PHONE_ERROR = {
  code: 'error',
  message: 'errMessage.phone_existed'
};

export const MAIL_ERROR = {
  code: 'error',
  message: 'errMessage.mail_existed'
};

export const SYSTEM_ERROR = {
  image: <ICSad />,
  title: 'errMessage.error_process_and_try_title',
  message: 'errMessage.error_process_and_try_message',
  btnName: 'common.confirm',
  type: 'noti',
  confirmAction: () => {}
};

export const REQUEST_UPDATE_VERSION = {
  code: 'update',
  message: 'aka_errMsg.requestUpdate',
  update: true
};

export const REQUIRE_SUPPORT_4 = {
  image: <ICTick />,
  title: 'errMessage.require_support_title',
  message: 'errMessage.require_support_4_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm',
  type: 'complete'
};

export const REQUIRE_SUPPORT_3 = {
  id: 3,
  image: <ICSupportRequire />,
  title: 'errMessage.require_support_title',
  message: 'errMessage.require_support_3_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm',
  nextContent: REQUIRE_SUPPORT_4
};

export const REQUIRE_SUPPORT_2 = {
  image: <ICSupportRequire />,
  title: 'errMessage.require_support_title',
  message: 'errMessage.require_support_2_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm',
  nextContent: REQUIRE_SUPPORT_3
};

export const REQUIRE_SUPPORT_1 = {
  id: 1,
  image: <ICSupportRequire />,
  title: 'errMessage.require_support_title',
  message: 'errMessage.require_support_1_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm',
  nextContent: REQUIRE_SUPPORT_2
};

export const REQUIRE_LOGIN = {
  imageDefault: require_login,
  title: 'errMessage.require_login_title',
  message: 'errMessage.require_login_message',
  btnName: 'errMessage.require_login_btn_name',
  type: 'noti'
};

export const REQUIRE_TOPENER = {
  imageDefault: require_login,
  title: 'errMessage.require_topener_title',
  message: 'errMessage.require_topener_message',
  btnName: 'errMessage.require_topener_title',
  type: 'noti'
};

export const CANCEL_RECORDS_2 = {
  image: <ICCancel />,
  title: 'errMessage.cancel_records_title',
  message: 'errMessage.cancel_records_2_message',
  type: 'complete'
};

export const CANCEL_RECORDS_1 = {
  image: <ICCancel />,
  title: 'errMessage.cancel_records_title',
  message: 'errMessage.cancel_records_1_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm',
  nextContent: CANCEL_RECORDS_2,
  noClose: true
};

export const ERROR_PROCESS = {
  image: <ICSad />,
  title: 'errMessage.error_process_title',
  message: 'errMessage.error_process_message',
  type: 'complete'
};

export const ERROR_PROCESS_AND_TRY = {
  image: <ICSad />,
  title: 'errMessage.error_process_and_try_title',
  message: 'errMessage.error_process_and_try_message',
  btnName: 'common.confirm',
  type: 'noti',
  confirmAction: () => {}
};

export const ERROR_SESSION_EXPIRED = {
  image: <ICSad />,
  title: 'errMessage.session_expired_title',
  message: 'errMessage.session_expired_message',
  type: 'complete'
};

export const CONFIRM_SEND = {
  image: <ICSendConfirm />,
  title: 'errMessage.confirm_send_title',
  message: '',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm'
};

export const CANCEL_CREDIT = {
  image: <ICCancel />,
  title: 'errMessage.cancel_credit_title',
  message: 'errMessage.cancel_credit_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm'
};

export const CANCEL_INSURANCE = {
  image: <ICCancel />,
  title: 'errMessage.cancel_insurance_title',
  message: 'errMessage.cancel_insurance_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm',
  noClose: true
};

export const CHANGE_CREDIT_PRODUCT = {
  image: <ICInfoConfirm />,
  title: 'errMessage.change_credit_product_title',
  message: 'errMessage.change_credit_product_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm'
};

export const CANCEL_EXTRA_SERVICE = {
  image: <ICCancel />,
  title: 'errMessage.cancel_extra_service_title',
  message: 'errMessage.cancel_extra_service_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm',
  noClose: true
};

export const CONFIRM_QUOTE_SERVICE = {
  image: <ICInfoConfirm />,
  title: 'application_list.confirm_quote',
  message: 'errMessage.confirm_quote_message',
  btnLeft: 'credit_order_status.cancel',
  btnRight: 'common.confirm',
  noClose: true
};

export const CANCEL_SUCCESS = {
  image: <ICSuccessAlert />,
  title: 'errMessage.cancel_success_title',
  message: 'errMessage.cancel_success_message',
  btnName: 'common.confirm',
  type: 'noti',
  confirmAction: () => {},
  noClose: true
};

export const CONFIRM_QUOTE_SUCCESS = {
  image: <ICSuccessAlert />,
  title: 'application_list.confirm_quote',
  message: 'errMessage.confirm_quote_message_success',
  btnName: 'common.confirm',
  type: 'noti',
  confirmAction: () => {},
  noClose: true
};

export const SEND_SUCCESS = {
  image: <ICTick />,
  title: 'errMessage.send_success_title',
  message: 'errMessage.send_success_message',
  type: 'complete'
};

export const SEND_SUCCESS_2 = {
  image: <ICTick />,
  title: 'errMessage.send_success_title_2',
  message: 'errMessage.send_success_message_2',
  type: 'complete'
};

export const CONFIRM_DELETE_LEAD = {
  //image: <ICDeleteProfile />,
  title: 'errMessage.confirm_delete_lead_title',
  message: 'errMessage.confirm_delete_lead_message',
  btnLeft: 'common.cancel_02',
  btnRight: 'common.confirm',
  noClose: true
};

export const DELETE_LEAD_SUCCESS = {
  image: <ICSuccessAlert />,
  title: 'errMessage.delete_lead_success_title',
  message: 'errMessage.delete_lead_success_message',
  btnName: 'common.isUnderstand',
  type: 'noti',
  confirmAction: () => {},
  noClose: true
};

export const DELETE_LEAD_ERROR = {
  image: <ICCancel />,
  title: 'errMessage.delete_lead_error_title',
  message: 'errMessage.delete_lead_error_message',
  type: 'complete'
};

export const REQUEST_UDPATE_EMAIL = {
  image: <ICSupportRequire />,
  title: 'errMessage.require_update_email_title',
  message: 'errMessage.require_update_email_message',
  type: 'complete'
};

export const CANNOT_UPDATE_LEAD = {
  image: <ICSupportRequire />,
  title: 'error_msg.notification',
  message: 'error_msg.cannot_update_lead',
  type: 'complete'
};

export const CANNOT_CREATE_LEAD = {
  image: <ICSupportRequire />,
  title: 'error_msg.notification',
  message: 'error_msg.cannot_create_lead',
  type: 'complete'
};

export const COMPARE_PRODUCT = {
  image: <ICSupportRequire />,
  title: 'error_msg.notification',
  message: 'errMessage.compare_product_title',
  btnName: 'common.isUnderstand',
  type: 'noti',
  noClose: true,
  confirmAction: () => {}
};

export const CANNOT_CREATE_ADDITIONAL_SERVICE = {
  image: <ICSupportRequire />,
  title: 'error_msg.notification',
  message: 'error_msg.cannot_create_additional_service',
  type: 'complete'
};

export const CREATE_SCHEDULE = {
  image: <ICTick />,
  title: 'common.success',
  message: 'schedule.create_success',
  type: 'complete'
};

export const DELETE_SCHEDULE_2 = {
  image: <ICTick />,
  title: 'common.success',
  message: 'schedule.delete_success',
  type: 'complete'
};

export const DELETE_SCHEDULE_1 = {
  image: <ICCancel />,
  title: 'schedule.confirm_delete',
  message: 'schedule.confirm_delete_desc',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm',
  nextContent: DELETE_SCHEDULE_2
};

export const SCHEDULE_ERROR_INPUT = {
  image: <ICCancel />,
  title: 'common.error',
  message: 'schedule.error',
  type: 'complete'
};

export const CALL_API_ERROR = {
  image: <ICCancel />,
  title: 'common.error',
  type: 'complete'
};
export const CREATE_OR_EDIT_INSURANCE_ORDER_ERROR = {
  image: <ICCancel />,
  title: 'error_msg.notification',
  message: 'error_msg.cannot_create_order_insurance',
  type: 'complete'
};

export const CONFIRM_SAVE_DRAFT_INSURANCE_ORDER = {
  image: <ICSupportRequire />,
  title: 'error_msg.confirm_return',
  message: 'error_msg.confirm_return_message',
  btnLeft: 'common.no',
  btnRight: 'common.save_draft'
};

export const UPLOAD_FILE_ERROR = {
  image: <ICSad />,
  title: 'errMessage.upload_file_error_title',
  message: 'errMessage.upload_file_error_message',
  type: 'complete'
};

export const SCAN_ID_CARD_ERROR = {
  image: <ICSad />,
  title: 'errMessage.scan_id_card_error_title',
  message: 'errMessage.scan_id_card_error_message',
  type: 'complete'
};

export const PAYMENT_ERROR = {
  image: <ICCancel />,
  title: 'errMessage.payment_error_title'
};

export const CONNECTION_ERROR = {
  image: <ICCancel />,
  title: 'errMessage.connection_error_title',
  type: 'complete'
};

export const ADD_IMG_FAILED = {
  image: <ICCancel />,
  title: 'error_msg.upload_image',
  message: 'error_msg.image_size',
  type: 'complete'
};

export const TIME_INPUT_ERROR = {
  image: <ICCancel />,
  title: 'errMessage.time_input_error_title',
  message: 'errMessage.time_input_error_message',
  type: 'complete'
};

export const REMOVE_NOTIFICATION = {
  message: 'error_msg.remove_notification',
  image: <ICCancel />,
  title: 'error_msg.remove_notification_title',
  btnLeft: 'common.cancel_02',
  btnRight: 'common.confirm'
};

export const REMOVE_NOTIFICATION_SUCCESS = {
  image: <ICTick />,
  title: 'error_msg.remove_notification_success_title',
  message: 'error_msg.remove_notification_success_message',
  type: 'complete'
};

export const EVENT_NOTIFY = {
  image: <ICSupportRequire />,
  title: 'screen_name.notification'
};

export const UPDATE_PROFILE_FAILED = {
  image: <ICSupportRequire />,
  title: 'success_msg.error_title',
  message: 'success_msg.update_profile_failure',
  type: 'complete'
};

export const CONFIRM_PAYMENT = {
  image: <ICInfoConfirm />,
  message: 'warning_msg.pay_later',
  btnLeft: 'common.pay_later',
  btnRight: 'common.payment'
};

export const CONFIRM_RETURN = {
  image: <ICTick />,
  message: 'warning_msg.message_return',
  title: 'warning_msg.return',
  btnLeft: 'common.dont_save',
  btnRight: 'common.save'
};

export const CONFIRM_REFUND_REQUEST = {
  image: <ICQuestionPopup />,
  title: 'info_account_deposit.popup_title',
  message: 'info_account_deposit.popup_message',
  btnLeft: 'common.later',
  btnRight: 'common.confirm'
};

export const FINGER_PRINT_AUTH = {
  image: <ICFingerPrintNotAuth />,
  title: 'pin.unlock_failed',
  btnName: 'pin.open_with_lock',
  type: 'noti',
  confirmAction: () => {}
};

export const FACE_ID_AUTH = {
  image: <ICFaceIDNotAuth />,
  title: 'pin.unlock_failed',
  type: 'noti',
  btnName: 'pin.open_with_lock',
  confirmAction: () => {}
};

export const FINGER_PRINT_NOT_REGISTERED = {
  image: <ICFingerPrintNotAuth />,
  title: 'pin.finger_print_not_registered',
  btnName: 'pin.open_with_lock',
  type: 'noti',
  confirmAction: () => {}
};

export const FACE_ID_NOT_REGISTERED = {
  image: <ICFaceIDNotAuth />,
  title: 'pin.face_id_not_registered',
  type: 'noti',
  btnName: 'pin.open_with_lock',
  confirmAction: () => {}
};

export const REQUIRE_ID = {
  image: <ICSupportRequire />,
  title: 'errMessage.update_info_title',
  message: 'errMessage.require_update_info',
  btnLeft: 'common.cancel_02',
  btnRight: 'common.confirm'
};

export const CONFIRM_LEAVE_GROUP_REQUEST = {
  image: <ICLeaveGroup />,
  title: 'errMessage.confirm_leave_group_title',
  message: 'errMessage.leave_group_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm'
};

export const CONFIRM_CANCEL_JOIN_REQUEST = {
  image: <ICLeaveGroup />,
  title: 'errMessage.cancel_request_join_title',
  message: 'errMessage.cancel_request_join_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm'
};
export const CONFIRM_CANCEL_LEAVE_REQUEST = {
  image: <ICLeaveGroup />,
  title: 'errMessage.cancel_request_leave_title',
  message: 'errMessage.cancel_request_leave_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm'
};

export const SUBMIT_REQUEST_SUCCESS = {
  image: <ICTick />,
  title: 'errMessage.submit_request_success_title',
  message: 'errMessage.submit_request_success_message',
  type: 'complete'
};
export const SUBMIT_REQUEST_FAILURE = {
  image: <ICSad />,
  title: 'errMessage.submit_request_failure_title',
  type: 'complete'
};

export const CONFIRM_DELETE_MEMBER = {
  image: <ICInfoConfirm />,
  title: 'errMessage.confirm_remove_member_title',
  message: 'errMessage.confirm_remove_member_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm'
};

export const ERROR_REFERRAL_NOT_EXIST = {
  image: <ICSad />,
  title: 'referral.referral_not_exist',
  type: 'complete'
};

export const ERROR_REFERRAL_EXISTED = {
  image: <ICSad />,
  title: 'referral.referral_existed',
  type: 'complete'
};

export const ERROR_REFERRAL_UPDATE = {
  image: <ICSad />,
  message: 'errMessage.error_tryAgain',
  type: 'complete'
};

export const SUCCESS_REFERRAL_UPDATE = {
  image: <ICTick />,
  title: 'referral.referral_update_success',
  type: 'complete'
};
export const SUBMIT_REQUEST_REJECT_JOIN_REQUEST_SUCCESS = {
  image: <ICTick />,
  title: 'errMessage.submit_reject_request_join_success_title',
  message: '',
  type: 'complete'
};

export const SUBMIT_REQUEST_ACCEPT_JOIN_REQUEST_SUCCESS = {
  image: <ICTick />,
  title: 'errMessage.submit_accept_request_join_success_title',
  message: '',
  type: 'complete'
};

export const SUBMIT_REQUEST_REJECT_LEAVE_REQUEST_SUCCESS = {
  image: <ICTick />,
  title: 'errMessage.submit_reject_request_leave_success_title',
  message: '',
  type: 'complete'
};
export const SUBMIT_REQUEST_ACCEPT_LEAVE_REQUEST_SUCCESS = {
  image: <ICTick />,
  title: 'errMessage.submit_accept_request_leave_success_title',
  message: '',
  type: 'complete'
};

export const CONFIRM_ACCEPT_REQUEST_LEAVE = {
  image: <ICLeaveGroup />,
  title: 'errMessage.confirm_accept_request_leave_title',
  message: 'errMessage.confirm_accept_request_leave_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm'
};

export const CONFIRM_REJECT_REQUEST_LEAVE = {
  image: <ICLeaveGroup />,
  title: 'errMessage.confirm_reject_request_leave_title',
  message: 'errMessage.confirm_reject_request_leave_message',
  btnLeft: 'common.cancel',
  btnRight: 'common.confirm'
};

export const CONFIRM_REQUEST_LEAVE_GROUP = {
  image: <ICTick />,
  title: 'errMessage.submit_request_success_title',
  message: 'errMessage.confirm_leave_group_message',
  type: 'complete'
};

export const CANCEL_REQUEST_LEAVE_GROUP = {
  image: <ICTick />,
  title: 'errMessage.submit_request_success_title',
  message: 'errMessage.cancel_leave_group_message',
  type: 'complete'
};

export const REQUEST_SUCCESS = {
  image: <ICTick />,
  title: 'errMessage.submit_request_success_title',
  message: 'errMessage.request_success_message',
  type: 'complete'
};
export const CANCEL_REQUEST_SUCCESS = {
  image: <ICTick />,
  title: 'errMessage.submit_request_success_title',
  message: 'errMessage.cancel_request_success_message',
  type: 'complete'
};

export const CONFIRM_DELETE_CHAT_HISTORY = {
  title: 'errMessage.delete_chat_title',
  message: 'errMessage.delete_chat_message',
  btnLeft: 'chat.do_not_delete',
  btnRight: 'chat.delete',
  type: 'chat',
  noClose: true
};

export const CONFIRM_BLOCK_CHAT = {
  title: 'errMessage.block_chat_title',
  message: 'errMessage.block_chat_message',
  btnLeft: 'common.yes',
  btnRight: 'common.no',
  type: 'chat',
  noClose: true,
  btnBlock: true
};

export const CONFIRM_SAVE_DRAFT_ORDER = {
  image: <ICSupportRequire />,
  title: 'error_msg.confirm_return',
  message: 'error_msg.confirm_return_message',
  btnLeft: 'common.no',
  btnRight: 'common.save'
};

export const CONFIRM_SAVE_ORDER = {
  image: <ICSupportRequire />,
  title: 'error_msg.confirm_return',
  message: 'error_msg.confirm_save_order_message',
  btnLeft: 'common.no',
  btnRight: 'common.save'
};

export const PASSWORD_ERROR = {
  code: 'error',
  message: 'errMessage.phone_existed',
  title: 'common.error',
  type: 'complete'
};

export const CREATE_EDIT_TRANSACTION_FAILURE = {
  image: <ICSad />,
  title: 'errMessage.submit_request_failure_title',
  type: 'complete'
};