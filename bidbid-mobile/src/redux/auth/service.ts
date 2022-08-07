import {
  ActionChangePhoneNumberPayload,
  ActionLinkSocialPayload,
  ActionLoginPayload,
  ActionSendCodeEmailPayload,
  ActionValidateUserPayload,
  ActionVerifyCodeChangePhonePayload,
  ActionVerifyEmailPayload,
  RequestSms,
} from './index';
import { Auth } from '@/services';

export const login: (param: ActionLoginPayload) => Promise<any> = async (param: ActionLoginPayload) => {
  try {
    const response = await Auth.login(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const signUpPhone: (param: RequestSms) => Promise<any> = async (param: RequestSms) => {
  try {
    const response = await Auth.signUpPhone(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const linkSocial: (param: ActionLinkSocialPayload) => Promise<any> = async (param: ActionLinkSocialPayload) => {
  try {
    const response = await Auth.linkSocial(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const validateUser: (param: ActionValidateUserPayload) => Promise<any> = async (param: ActionValidateUserPayload) => {
  try {
    const response = await Auth.validateUser(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const logout: () => void = async () => {
  try {
    const response = await Auth.logout();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const sendCodeEmail: (param: ActionSendCodeEmailPayload) => Promise<any> = async (param: ActionSendCodeEmailPayload) => {
  try {
    const response = await Auth.sendEmailCode(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const verifyEmail = async (param: ActionVerifyEmailPayload) => {
  try {
    const response = await Auth.verifyEmail(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const changePhoneNumber = async (param: ActionChangePhoneNumberPayload) => {
  try {
    const response = await Auth.changePhoneNumber(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const verifyCodeChangePhone = async (param: ActionVerifyCodeChangePhonePayload) => {
  try {
    const response = await Auth.verifyCodeChangePhone(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
