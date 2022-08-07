import axios, { AxiosInstance } from 'axios';
import { IError } from '@models/error';

export const baseURL = 'http://localhost:3000';

export enum IServiceMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

class Service {
  token?: string;

  instance: AxiosInstance;

  subscribers: any = [];

  isAlreadyFetchingAccessToken = false;

  constructor(opts: { baseURL: string }) {
    this.instance = axios.create({
      baseURL: opts.baseURL || baseURL,
    });
  }

  setToken = (token: string): void => {
    this.token = token;
  };

  removeToken = (): void => {
    this.token = undefined;
  };

  request = async (method: IServiceMethod = IServiceMethod.GET, url: string, options?: any) => {
    try {
      const { headers } = options;
      const result = await this.instance.request({
        url,
        method,
        headers: {
          'Content-Type': 'application/json',
          authorization: this.token,
          ...headers,
        },
        timeout: 15 * 1000,
        timeoutErrorMessage: 15 * 1000,
        ...options,
      });
      axios.defaults.timeout = 15 * 1000;
      return { result: result.data };
    } catch (err) {
      const error: IError = {
        code: err.response.status,
        message: err.response.statusMessage || err.response.data,
        data: err.response.data,
      };
      return { error };
    }
  };

  get = async (url: string, params: any, options?: any) => {
    return await this.request(IServiceMethod.GET, url, { params, ...options });
  };

  post = async (url: string, data: any, options?: any) => {
    return await this.request(IServiceMethod.POST, url, { data, ...options });
  };

  put = async (url: string, data: any, options?: any) => {
    return await this.request(IServiceMethod.PUT, url, { data, ...options });
  };

  delete = async (url: string, options?: any) => {
    return await this.request(IServiceMethod.DELETE, url, options);
  };
}

export default new Service({ baseURL });
