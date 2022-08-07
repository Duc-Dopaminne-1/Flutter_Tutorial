import { IService } from './index';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';
import { IError } from '@src/models/callback';

export enum IServiceMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

class Service {
  Gate?: IService;

  token?: string;

  instance: AxiosInstance;

  subscribers: any = [];

  isAlreadyFetchingAccessToken = false;

  constructor(opts: { baseUrl: string }) {
    this.instance = axios.create({
      baseURL: opts.baseUrl,
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
        ...options,
      });
      axios.defaults.timeout = 15 * 1000;
      return { result: result.data };
    } catch (err) {
      const error: IError = {
        code: _.get(err, 'response.status', _.get(err, 'status', '500')),
        message: _.get(err, 'response.statusMessage', _.get(err, 'response.data')),
        data: _.get(err, 'response.data'),
      };
      return { error };
    }
  };

  get = async (url: string, params: any, options?: any) => {
    await this.request(IServiceMethod.GET, url, { params, ...options });
  };

  post = async (url: string, data: any, options?: any) => {
    await this.request(IServiceMethod.POST, url, { data, ...options });
  };

  put = async (url: string, data: any, options?: any) => {
    await this.request(IServiceMethod.PUT, url, { data, ...options });
  };

  delete = async (url: string, options?: any) => {
    await this.request(IServiceMethod.DELETE, url, options);
  };
}

export default Service;
