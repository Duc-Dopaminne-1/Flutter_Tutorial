import {
  ActionTypes,
  ActionCallback,
  ActionLogout,
  ActionSignUp,
  ActionSignUpPayload,
  ActionRefreshToken,
  ActionRefreshTokenPayload,
  ActionLoginPayload,
  ActionLinkSocialPayload,
  ActionLinkSocial,
  ActionLogin,
  ActionValidateUser,
  ActionValidateUserPayload,
  ActionSaveSocialPayload,
  ActionSaveSocial,
  ActionSendCodeEmail,
  ActionSendCodeEmailPayload,
  ActionSaveTokenEmail,
  ActionSaveTokenEmailPayload,
  ActionVerifyEmail,
  ActionVerifyEmailPayload,
  ActionChangePhoneNumber,
  ActionChangePhoneNumberPayload,
  ActionVerifyCodeChangePhone,
  ActionVerifyCodeChangePhonePayload,
} from './index';

function signUpPhone(payload: ActionSignUpPayload): ActionSignUp {
  return {
    type: ActionTypes.SIGN_UP_PHONE,
    payload,
  };
}

function login(payload: ActionLoginPayload): ActionLogin {
  return {
    type: ActionTypes.LOGIN,
    payload,
  };
}

function logout(payload: ActionCallback): ActionLogout {
  return {
    type: ActionTypes.LOG_OUT,
    payload,
  };
}

function refreshToken(payload: ActionRefreshTokenPayload): ActionRefreshToken {
  return {
    type: ActionTypes.REFRESH_TOKEN,
    payload,
  };
}

function linkSocial(payload: ActionLinkSocialPayload): ActionLinkSocial {
  return {
    type: ActionTypes.LINK_SOCIAL,
    payload,
  };
}

function validateUser(payload: ActionValidateUserPayload): ActionValidateUser {
  return {
    type: ActionTypes.VALIDATE_USER,
    payload,
  };
}

function saveSocial(payload: ActionSaveSocialPayload): ActionSaveSocial {
  return {
    type: ActionTypes.SAVE_SOCIAL,
    payload,
  };
}

function sendCodeEmail(payload: ActionSendCodeEmailPayload): ActionSendCodeEmail {
  return {
    type: ActionTypes.SEND_CODE_EMAIL,
    payload,
  };
}

function saveTokenEmail(payload: ActionSaveTokenEmailPayload): ActionSaveTokenEmail {
  return {
    type: ActionTypes.SAVE_TOKEN_EMAIL,
    payload,
  };
}

function verifyEmail(payload: ActionVerifyEmailPayload): ActionVerifyEmail {
  return {
    type: ActionTypes.VERIFY_EMAIL,
    payload,
  };
}

function changePhoneNumber(payload: ActionChangePhoneNumberPayload): ActionChangePhoneNumber {
  return {
    type: ActionTypes.CHANGE_PHONE_NUMBER,
    payload,
  };
}

function verifyCodeChangePhone(payload: ActionVerifyCodeChangePhonePayload): ActionVerifyCodeChangePhone {
  return {
    type: ActionTypes.VERIFY_CODE_CHANGE_PHONE,
    payload,
  };
}

export {
  verifyCodeChangePhone,
  changePhoneNumber,
  signUpPhone,
  linkSocial,
  login,
  logout,
  refreshToken,
  validateUser,
  saveSocial,
  sendCodeEmail,
  saveTokenEmail,
  verifyEmail,
};
