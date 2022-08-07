import * as actions from './actions';
import { Action } from 'redux';
import authSaga from './saga';
import reducer from './reducer';
import { IActionCallback, IError } from '@src/models/callback';
import { UserProfileParams } from '@reup/reup-api-sdk/libs/api/user';
import { UserRegisterParams, SocialLoginParams } from '@reup/reup-api-sdk/libs/api/auth/adapter/adapter';
import { IUser } from '@reup/reup-api-sdk/libs/api/user/models';

// Action Types
export enum ActionTypes {
  LOGIN = 'AUTH_LOGIN',
  SIGN_UP = 'AUTH_SIGN_UP',
  LOG_OUT = 'AUTH_LOG_OUT',
  SAVE_USER = 'SAVE_USER',
  LOGIN_GOOGLE = 'LOGIN_GOOGLE',
  LOGIN_FACEBOOK = 'LOGIN_FACEBOOK',
  GET_CURRENT_USER = 'GET_CURRENT_USER',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  UPDATE_TOKEN = 'UPDATE_TOKEN',
  IS_AUTHENTICATED = 'IS_AUTHENTICATED',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  UPLOAD_AVATAR = 'UPLOAD_AVATAR',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  UPLOAD_IMAGE = 'UPLOAD_IMAGE',
  RESET_PASSWORD = 'RESET_PASSWORD',
  LOGIN_APPLE = 'LOGIN_APPLE',
  OTP_VERIFY = 'OTP_VERIFY',
}

export enum CommonActionType {
  RESET_ALL_STATE = '@HD/RESET_ALL_STATE',
}

// Models
export interface IOauthToken {
  accessToken?: string;
  refreshToken?: string;
}

// State
export interface IAuthState {
  tryAuthDone: boolean;
  logging: boolean;
  user?: any;
  error?: IError;
}

// Payload
export interface IActionLoginPayload extends IActionCallback {
  email: string;
  password: string;
}

export interface IActionSignUpPayload extends IActionCallback {
  body: UserRegisterParams;
}

export interface IActionUpdateProfilePayload extends IActionCallback {
  data: UserProfileParams;
}

export interface IActionChangePasswordPayload extends IActionCallback {
  newPassword: string;
}

export interface IActionLoginApplePayload extends IActionCallback {
  data: SocialLoginParams
}

export interface IActionResetPasswordPayload extends IActionCallback {
  email: string;
}

export interface IActionConfirmOTPPayload extends IActionCallback {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IActionUploadImagePayload extends IActionCallback {
  data: FormData,
  progress: (percent: number) => void
}

export interface IActionLoginGooglePayload extends IActionCallback {
  accessToken: string;
}

export interface IActionLoginFacebookPayload extends IActionCallback {
  accessToken: string;
}

// Actions

export interface IActionLoginGoogle extends Action {
  type: ActionTypes.LOGIN_GOOGLE;
  payload: IActionLoginGooglePayload;
}

export interface IActionLoginFacebook extends Action {
  type: ActionTypes.LOGIN_FACEBOOK;
  payload: IActionLoginFacebookPayload;
}

export interface IActionLogin extends Action {
  type: ActionTypes.LOGIN;
  payload: IActionLoginPayload;
}

export interface IActionSignUp extends Action {
  type: ActionTypes.SIGN_UP;
  payload: IActionSignUpPayload;
}

export interface IActionLogout extends Action {
  type: ActionTypes.LOG_OUT;
  payload: IActionCallback;
}

export interface IActionResetAllState extends Action {
  type: CommonActionType.RESET_ALL_STATE;
}

export interface IActionSaveUser extends Action {
  type: ActionTypes.SAVE_USER;
  payload: any;
}

export interface IActionGetCurrentUser extends Action {
  type: ActionTypes.GET_CURRENT_USER;
  payload: IActionCallback;
}

export interface IActionRefreshToken extends Action {
  type: ActionTypes.REFRESH_TOKEN;
  payload: IActionCallback;
}

export interface IActionUpdateToken extends Action {
  type: ActionTypes.UPDATE_TOKEN;
}

export interface IActionIsAuthenticated extends Action {
  type: ActionTypes.IS_AUTHENTICATED;
  payload: IActionCallback;
}

export interface IActionUpdateProfile extends Action {
  type: ActionTypes.UPDATE_PROFILE;
  payload: IActionUpdateProfilePayload;
}

export interface IActionChangePassword extends Action {
  type: ActionTypes.CHANGE_PASSWORD;
  payload: IActionChangePasswordPayload;
}

export interface IActionResetPassword extends Action {
  type: ActionTypes.RESET_PASSWORD;
  payload: IActionResetPasswordPayload;
}
export interface IActionConfirmOTP extends Action {
  type: ActionTypes.OTP_VERIFY;
  payload: IActionConfirmOTPPayload;
}

export interface IActionUploadImage extends Action {
  type: ActionTypes.UPLOAD_IMAGE;
  payload: IActionUploadImagePayload;
}

export interface IActionLoginApple extends Action {
  type: ActionTypes.LOGIN_APPLE,
  payload: IActionLoginApplePayload,
}

export type IAuthAction =
  | IActionLogin
  | IActionSignUp
  | IActionLogout
  | IActionSaveUser
  | IActionGetCurrentUser
  | IActionRefreshToken
  | IActionUpdateToken
  | IActionIsAuthenticated
  | IActionResetAllState
  | IActionUpdateProfile
  | IActionChangePassword
  | IActionResetPassword
  | IActionConfirmOTP
  | IActionLoginApple
  | IActionUploadImage

// Result
export interface ITokenOrError {
  token?: string;
  error?: IError;
}

export interface IUserOrError {
  oAuthToken?: IOauthToken;
  error?: IError;
}

export interface IApiResponse<T> {
  isSuccess?: boolean;
  value?: T;
  error?: IError;
}

export type IUserOrNull = IUser | null;

// Gate methods
export type ILogin = (email: string, password: string) => Promise<IApiResponse<IOauthToken>>;
export type ILogout = () => Promise<any>;
export type IGetCurrentUser = () => Promise<IApiResponse<IUser>>;
export type IRefreshToken = () => Promise<any>;
export type IIsAuthenticated = () => Promise<boolean>;

// Gate
export interface IService {
  login: ILogin;
  logout: ILogout;
  getCurrentUser: IGetCurrentUser;
}

export { actions, reducer, authSaga };
