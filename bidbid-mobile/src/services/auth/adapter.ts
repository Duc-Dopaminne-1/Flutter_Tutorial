import { ApiClient, IAuthenticator, IAuthToken } from '../http/client';
import {
  ActionChangePhoneNumberPayload,
  ActionLinkSocialPayload,
  ActionLoginPayload,
  ActionSendCodeEmailPayload,
  ActionValidateUserPayload,
  ActionVerifyCodeChangePhonePayload,
  ActionVerifyEmailPayload,
  RequestSms,
} from '@/redux/auth';
import { ActionSaveProfilePayload } from '@/redux/createProfile';
import * as Sentry from '@sentry/react-native';
import { LOCALE } from '@/constants/app';
import { remove } from '@/services/storage';

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthAdapter extends IAuthenticator {
  logout(): void;
  signUpPhone(params: RequestSms): Promise<any>;
  refreshToken(): void;
  setAuthToken(data: Token): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

export abstract class AbstractAuthAdapter implements IAuthAdapter {
  abstract getAuthToken(): Promise<IAuthToken | null>;
  abstract getAuthSmsToken(): Promise<IAuthToken | null>;
  abstract refreshToken(): Promise<void>;

  async getAuthHeader(): Promise<string> {
    const authToken = await this.getAuthToken();
    if (!authToken || !authToken.access_token) {
      return '';
    }

    if (authToken.token_type) {
      return `${authToken.token_type} ${authToken.access_token}`;
    }
    return authToken.access_token;
  }

  async getAuthSmsHeader(): Promise<string> {
    const authToken = await this.getAuthSmsToken();
    if (!authToken || !authToken.access_token) {
      return '';
    }
    if (authToken.token_type) {
      return `${authToken.token_type} ${authToken.access_token}`;
    }
    return authToken.access_token;
  }

  async logout(): Promise<any> {
    const config = ApiClient.getApiConfig();
    const sessionStorage = config.session;
    const fcmToken: any = await sessionStorage.get(config.FCM_TOKEN);
    if (fcmToken) {
      await ApiClient.delete('/devices', { token: fcmToken });
      await remove(config.FCM_TOKEN);
    }
    await sessionStorage.remove(LOCALE);
    await sessionStorage.remove(config.AUTH_SESSION_KEY);
    await sessionStorage.remove(config.AUTH_SMS_SESSION_KEY);
    Sentry.setUser(null);
  }

  async setAuthToken(data: Token): Promise<void> {
    const config = ApiClient.getApiConfig();
    const sessionStorage = config.session;
    await sessionStorage.set(config.AUTH_SESSION_KEY, JSON.stringify(data));
  }

  async setAuthSmsToken(data: string): Promise<void> {
    const config = ApiClient.getApiConfig();
    const sessionStorage = config.session;
    await sessionStorage.set(config.AUTH_SMS_SESSION_KEY, data);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    if (token) {
      return true;
    }
    return false;
  }

  async signUpPhone(params: RequestSms): Promise<any> {
    const r = await ApiClient.post('/auth/otp', params, {}, {}, false, false);
    return r;
  }

  async login(params: ActionLoginPayload): Promise<any> {
    if (params.isCheckExist) {
      delete params.isCheckExist;
      const r = await ApiClient.post('/auth/login', params, {}, {}, false, false);
      return r;
    }

    const r = await ApiClient.post('/auth/login', params, {}, {}, false, false);
    if (r.hasOwnProperty('refreshToken')) {
      const token = {
        accessToken: r.accessToken,
        refreshToken: r.refreshToken,
      };
      await this.setAuthToken(token);
      await this.setAuthSmsToken(token.accessToken);
    } else {
      await this.setAuthSmsToken(r.accessToken);
    }
    return r;
  }

  async sendEmailCode(params: ActionSendCodeEmailPayload): Promise<any> {
    const r = await ApiClient.post('/auth/verify-email', params, {}, {}, false, true);
    return r;
  }

  async verifyEmail(params: ActionVerifyEmailPayload): Promise<any> {
    const r = await ApiClient.post('/auth/confirm-email', params, {}, {}, false, false);
    return r;
  }

  async changePhoneNumber(params: ActionChangePhoneNumberPayload): Promise<any> {
    const r = await ApiClient.post('/auth/change-phone', params, {}, {});
    return r;
  }

  async verifyCodeChangePhone(params: ActionVerifyCodeChangePhonePayload): Promise<any> {
    const r = await ApiClient.post('/auth/verify-phone', params, {}, {});
    return r;
  }

  async linkSocial(params: ActionLinkSocialPayload): Promise<any> {
    const url = `/auth/register/${params.userId}/auth-provider`;
    const newParam = {
      accessToken: params.accessToken,
      type: params.type,
    };
    if (params.fromSetting) {
      const r = await ApiClient.patch(url, newParam, {}, {});
      return r;
    }
    const r = await ApiClient.patch(url, newParam, {}, {}, false, true);
    return r;
  }

  async createProfile(params: ActionSaveProfilePayload): Promise<any> {
    const { data, isSkipPhoneNumber } = params;
    if (isSkipPhoneNumber) {
      const r = await ApiClient.post('/auth/register', data, {}, {}, false, false);
      await this.setAuthToken(r);
      return r;
    }

    const r = await ApiClient.put('/auth/register', data, {}, {}, false, true);
    await this.setAuthToken(r);
    return r;
  }

  async validateUser(params: ActionValidateUserPayload): Promise<any> {
    const url = `/auth/users?phone-number=${params.phoneNumber}`;
    const r = await ApiClient.get(url, {}, false, false);
    return r;
  }
}
