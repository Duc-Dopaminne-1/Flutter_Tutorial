import { Action } from 'redux';

// Action Types
export enum ActionTypes {
  TRY_AUTH_DONE = 'TRY_AUTH_DONE',
  LOG_OUT = 'LOG_OUT',
  VALIDATE_USER = 'VALIDATE_USER',
  SAVE_SOCIAL = 'SAVE_SOCIAL',
  LOGIN = 'LOGIN',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  LINK_SOCIAL = 'LINK_SOCIAL',
  LINK_SOCIAL_SETTING = 'LINK_SOCIAL_SETTING',
  SIGN_UP_PHONE = 'SIGN_UP_PHONE',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  SEND_CODE_EMAIL = 'SEND_CODE_EMAIL',
  SAVE_TOKEN_EMAIL = 'SAVE_TOKEN_EMAIL',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  CHANGE_PHONE_NUMBER = 'CHANGE_PHONE_NUMBER',
  VERIFY_CODE_CHANGE_PHONE = 'VERIFY_CODE_CHANGE_PHONE',
}

export interface Error {
  message: string;
  code: number;
  data?: any;
}

// Payload
export interface ActionCallback {
  onSuccess?: (data?: any) => void;
  onFail?: (error?: any, code?: number) => void;
}

export interface RequestSms {
  phoneNumber: string;
}

export interface ActionSignUpPayload extends ActionCallback {
  param: RequestSms;
}

export interface ActionLoginPayload extends ActionCallback {
  token: string;
  provider: string;
  code?: string;
  isCheckExist?: boolean;
}

export interface ActionLinkSocialPayload extends ActionCallback {
  accessToken: string;
  type: string;
  userId: string;
  fromSetting?: boolean;
}

export interface ActionValidateUserPayload extends ActionCallback {
  phoneNumber: string;
}

export interface SocialPayload {
  accessToken: string;
  type: string;
}

export interface ActionSaveSocialPayload extends ActionCallback {
  social: SocialPayload;
}

export interface ActionUpdatePasswordPayload extends ActionCallback {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

export interface ActionSendCodeEmailPayload extends ActionCallback {
  email: string;
}

export interface ActionSaveTokenEmailPayload extends ActionCallback {
  token: string;
}

export interface ActionVerifyEmailPayload extends ActionCallback {
  token: string;
  code: string;
}

export type ActionRefreshTokenPayload = ActionCallback;

export interface ActionLinkSocial extends Action {
  type: ActionTypes.LINK_SOCIAL;
  payload: ActionLinkSocialPayload;
}

export interface ActionLinkSocialSettingPayload extends ActionCallback {
  accessToken: string;
  type: string;
  userId: string;
}

export interface ActionLinkSocialSetting extends Action {
  type: ActionTypes.LINK_SOCIAL_SETTING;
  payload: ActionLinkSocialSettingPayload;
}

export interface ActionSignUp extends Action {
  type: ActionTypes.SIGN_UP_PHONE;
  payload: ActionSignUpPayload;
}

export interface ActionLogin extends Action {
  type: ActionTypes.LOGIN;
  payload: ActionLoginPayload;
}

export interface ActionTryAuthDone extends Action {
  type: ActionTypes.TRY_AUTH_DONE;
}

export interface ActionLogout extends Action {
  type: ActionTypes.LOG_OUT;
  payload: ActionCallback;
}

export interface ActionValidateUser extends Action {
  type: ActionTypes.VALIDATE_USER;
  payload: ActionValidateUserPayload;
}

export interface ActionSaveSocial extends Action {
  type: ActionTypes.SAVE_SOCIAL;
  payload: ActionSaveSocialPayload;
}

export interface ActionSendCodeEmail extends Action {
  type: ActionTypes.SEND_CODE_EMAIL;
  payload: ActionSendCodeEmailPayload;
}

export interface ActionSaveTokenEmail extends Action {
  type: ActionTypes.SAVE_TOKEN_EMAIL;
  payload: ActionSaveTokenEmailPayload;
}

export interface ActionVerifyEmail extends Action {
  type: ActionTypes.VERIFY_EMAIL;
  payload: ActionVerifyEmailPayload;
}

export interface ActionUpdatePassword extends Action {
  type: ActionTypes.UPDATE_PASSWORD;
  payload: ActionUpdatePasswordPayload;
}

export interface ActionChangePhoneNumberPayload extends ActionCallback {
  phoneNumber: string;
}

export interface ActionChangePhoneNumber extends Action {
  type: ActionTypes.CHANGE_PHONE_NUMBER;
  payload: ActionChangePhoneNumberPayload;
}

export interface ActionVerifyCodeChangePhonePayload extends ActionCallback {
  code: string;
  token: string;
}

export interface ActionVerifyCodeChangePhone extends Action {
  type: ActionTypes.VERIFY_CODE_CHANGE_PHONE;
  payload: ActionVerifyCodeChangePhonePayload;
}

export interface ActionRefreshToken extends Action {
  type: ActionTypes.REFRESH_TOKEN;
  payload: ActionRefreshTokenPayload;
}

export type AuthAction =
  | ActionLogin
  | ActionSignUp
  | ActionTryAuthDone
  | ActionSaveTokenEmail
  | ActionLogout
  | ActionSendCodeEmail
  | ActionSaveSocial
  | ActionUpdatePassword
  | ActionVerifyEmail
  | ActionRefreshToken
  | ActionValidateUser;
