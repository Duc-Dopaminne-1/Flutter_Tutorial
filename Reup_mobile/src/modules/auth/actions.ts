import {
  ActionTypes,
  IActionLogin,
  IActionLoginPayload,
  IActionLogout,
  IActionGetCurrentUser,
  IActionRefreshToken,
  IActionUpdateToken,
  IActionIsAuthenticated,
  IActionResetAllState,
  CommonActionType,
  IActionUpdateProfilePayload,
  IActionUpdateProfile,
  IActionChangePasswordPayload,
  IActionChangePassword,
  IActionSignUpPayload,
  IActionSignUp,
  IActionResetPassword,
  IActionResetPasswordPayload,
  IActionLoginGoogle,
  IActionLoginGooglePayload,
  IActionLoginFacebook,
  IActionLoginFacebookPayload,
  IActionConfirmOTPPayload,
  IActionConfirmOTP,
  IActionLoginApplePayload,
  IActionLoginApple,
  IActionUploadImage,
  IActionUploadImagePayload,
  IActionUserDetail,
  IActionUserDetailPayload,
} from './index';
import { IActionCallback } from '@src/models/callback';

function login(payload: IActionLoginPayload): IActionLogin {
  return {
    type: ActionTypes.LOGIN,
    payload,
  };
}

function signUp(payload: IActionSignUpPayload): IActionSignUp {
  return {
    type: ActionTypes.SIGN_UP,
    payload,
  };
}

function logout(payload: IActionCallback): IActionLogout {
  return {
    type: ActionTypes.LOG_OUT,
    payload,
  };
}

function resetAllState(): IActionResetAllState {
  return {
    type: CommonActionType.RESET_ALL_STATE,
  };
}

function saveUser(payload: any) {
  return {
    type: ActionTypes.SAVE_USER,
    payload,
  };
}

function getCurrentUser(payload: IActionCallback): IActionGetCurrentUser {
  return {
    type: ActionTypes.GET_CURRENT_USER,
    payload,
  };
}

function refreshToken(payload: IActionCallback): IActionRefreshToken {
  return {
    type: ActionTypes.REFRESH_TOKEN,
    payload,
  };
}

function updateToken(): IActionUpdateToken {
  return {
    type: ActionTypes.UPDATE_TOKEN,
  };
}

function isAuthenticated(payload: IActionCallback): IActionIsAuthenticated {
  return {
    type: ActionTypes.IS_AUTHENTICATED,
    payload,
  };
}

function updateProfile(payload: IActionUpdateProfilePayload): IActionUpdateProfile {
  return {
    type: ActionTypes.UPDATE_PROFILE,
    payload,
  };
}

function changePassword(payload: IActionChangePasswordPayload): IActionChangePassword {
  return {
    type: ActionTypes.CHANGE_PASSWORD,
    payload,
  };
}

function resetPassword(payload: IActionResetPasswordPayload): IActionResetPassword {
  return {
    type: ActionTypes.RESET_PASSWORD,
    payload,
  };
}

function loginGoogle(payload: IActionLoginGooglePayload): IActionLoginGoogle {
  return {
    type: ActionTypes.LOGIN_GOOGLE,
    payload,
  };
}

function loginFacebook(payload: IActionLoginFacebookPayload): IActionLoginFacebook {
  return {
    type: ActionTypes.LOGIN_FACEBOOK,
    payload,
  };
}

function confirmOTP(payload: IActionConfirmOTPPayload): IActionConfirmOTP {
  return {
    type: ActionTypes.OTP_VERIFY,
    payload,
  };
}

function loginApple(payload: IActionLoginApplePayload): IActionLoginApple {
  return {
    type: ActionTypes.LOGIN_APPLE,
    payload,
  };
}

function uploadImage(payload: IActionUploadImagePayload): IActionUploadImage {
  return {
    type: ActionTypes.UPLOAD_IMAGE,
    payload,
  };
}

export {
  login,
  signUp,
  logout,
  saveUser,
  loginGoogle,
  loginFacebook,
  getCurrentUser,
  refreshToken,
  updateToken,
  isAuthenticated,
  resetAllState,
  updateProfile,
  changePassword,
  resetPassword,
  confirmOTP,
  loginApple,
  uploadImage,
};
