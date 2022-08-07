import { LOCALE } from '@/constants/app';
import axios from 'axios';
import { get } from '../storage';
import { ApiConfiguration } from './config';

class ApiError extends Error {
  constructor(public message: string, public code: string) {
    super(message);
  }
}

export interface IAuthToken {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  scope?: string;
  expires_in?: number;
}

export interface IAuthenticator {
  getAuthToken(): Promise<IAuthToken | null>;
  getAuthSmsToken(): Promise<IAuthToken | null>;
  getAuthHeader(): Promise<string>;
  getAuthSmsHeader(): Promise<string>;
}

export class ApiClient {
  static apiConfig: ApiConfiguration;
  static authenticator: IAuthenticator;

  static setApiConfig(apiConfig: ApiConfiguration): void {
    this.apiConfig = apiConfig;
  }

  static getApiConfig(): ApiConfiguration {
    return this.apiConfig;
  }

  static setAuthenticator(authenticator: IAuthenticator): ApiClient {
    this.authenticator = authenticator;
    return this;
  }

  static async getAuthToken(): Promise<IAuthToken | null> {
    if (!this.authenticator) {
      return null;
    }
    return this.authenticator.getAuthToken();
  }

  private static success(response: any): any {
    return response.data;
  }

  private static error(e: any): any {
    if (e.response && e.response.data) {
      const errorCode = e.response.data.hasOwnProperty('errorCode') ? e.response.data.errorCode : e.response.data.statusCode || 'unknown';
      const message = e.response.data.message || e.message;
      throw new ApiError(message, errorCode);
    }
    return this.handleUnknownError(e);
  }

  private static handleUnknownError(e: Error) {
    throw new ApiError(e.message, 'unknown');
  }

  private static uri(uri: string): string {
    return `${this.apiConfig.baseUrl}${uri}`;
  }

  private static async configs(params: any = {}, headers: any = {}, isAuthenticated = true, isAuthenticateSms = false): Promise<any> {
    let authHeader = '';
    if (isAuthenticateSms) {
      authHeader = await this.authenticator.getAuthSmsHeader();
    }
    if (isAuthenticated) {
      authHeader = await this.authenticator.getAuthHeader();
    }
    const { baseUrl } = this.apiConfig;
    if (authHeader !== '' && (isAuthenticated || isAuthenticateSms)) {
      headers = {
        ...headers,
        Authorization: authHeader,
      };
    }
    const persistedLocale = await get(LOCALE);
    headers = {
      ...headers,
      lang: persistedLocale || 'en',
    };
    return { baseUrl, headers, params, withCredentials: false, crossdomain: true };
  }

  static async customUrlGet(uri: string): Promise<any> {
    try {
      const r = await axios.get(uri);
      return this.success(r);
    } catch (e) {
      return this.error(e);
    }
  }

  static async get(uri: string, params: any = {}, isAuthenticated = true, isAuthenticateSms = false): Promise<any> {
    try {
      const config = await this.configs(params, {}, isAuthenticated, isAuthenticateSms);
      const r = await axios.get(this.uri(uri), config);
      return this.success(r);
    } catch (e) {
      return this.error(e);
    }
  }

  static async post(
    uri: string,
    data: any = {},
    params: any = {},
    headers: any = {},
    isAuthenticated = true,
    isAuthenticateSms = false,
  ): Promise<any> {
    try {
      const config = await this.configs(params, headers, isAuthenticated, isAuthenticateSms);
      const r = await axios.post(this.uri(uri), data, config);
      return this.success(r);
    } catch (e) {
      this.error(e);
    }
  }

  static async patch(
    uri: string,
    data: any = {},
    params: any = {},
    headers: any = {},
    isAuthenticated = true,
    isAuthenticateSms = false,
  ): Promise<any> {
    try {
      const config = await this.configs(params, headers, isAuthenticated, isAuthenticateSms);
      const r = await axios.patch(this.uri(uri), data, config);
      return this.success(r);
    } catch (e) {
      this.error(e);
    }
  }

  static async put(
    uri: string,
    data: any = {},
    params: any = {},
    headers: any = {},
    isAuthenticated = true,
    isAuthenticateSms = false,
  ): Promise<any> {
    try {
      const config = await this.configs(params, headers, isAuthenticated, isAuthenticateSms);
      const r = await axios.put(this.uri(uri), data, config);
      return this.success(r);
    } catch (e) {
      this.error(e);
    }
  }

  static async delete(uri: string, params: any = {}, isAuthenticated = true): Promise<any> {
    try {
      const config = await this.configs(params, {}, isAuthenticated);
      config['data'] = params;
      const r = await axios.delete(this.uri(uri), config);
      return this.success(r);
    } catch (e) {
      this.error(e);
    }
  }

  static async upload(uri: string, params: FormData, callback?: (progress: number) => void): Promise<any> {
    try {
      const r = await axios.post(uri, params, {
        onUploadProgress: function (progressEvent: any) {
          const { loaded } = progressEvent;
          const { total } = progressEvent;
          const percent = Math.round((loaded / total) * 100);
          if (callback !== null && callback !== undefined) {
            callback(percent);
          }
        }.bind(this),
      });
      return this.success(r);
    } catch (e) {
      this.error(e);
    }
  }
}
