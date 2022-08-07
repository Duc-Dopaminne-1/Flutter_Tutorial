export interface ISession {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<void>;
  remove(key: string): Promise<any>;
}

export interface ApiConfiguration {
  baseUrl: string;
  session: ISession;
  socketUrl: string;
  AUTH_SESSION_KEY: string;
  AUTH_SMS_SESSION_KEY: string;
  REFRESH_SESSION_KEY: string;
  FCM_TOKEN: string;
}
