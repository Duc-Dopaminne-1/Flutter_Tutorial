import { AbstractAuthAdapter } from './adapter';
import * as utils from '../utils';
import { ApiClient, IAuthToken } from '@/services/http/client';

export interface IJwtToken {
  accessToken: string;
  refreshToken: string;
}

export class JwtAuth extends AbstractAuthAdapter {
  async getAuthToken(): Promise<IAuthToken | null> {
    const config = ApiClient.getApiConfig();
    const jwtJson: any = await config.session.get(config.AUTH_SESSION_KEY);
    const jtwToken = utils.tryParseJson(jwtJson) as IJwtToken;

    if (!jtwToken || !jtwToken.accessToken) {
      return null;
    }
    return {
      token_type: 'Bearer',
      access_token: jtwToken.accessToken,
      refresh_token: jtwToken.refreshToken,
    };
  }

  async getAuthSmsToken(): Promise<IAuthToken | null> {
    const config = ApiClient.getApiConfig();
    const jwtToken: any = await config.session.get(config.AUTH_SMS_SESSION_KEY);
    if (!jwtToken) {
      return null;
    }
    return {
      token_type: 'Bearer',
      access_token: jwtToken,
    };
  }

  async refreshToken(): Promise<void> {
    const token = await this.getAuthToken();
    if (!token) {
      return;
    }
    const refresh = token.refresh_token;
    const data = { refresh };
    const r: IJwtToken = await ApiClient.post('/token/refresh/', data, {}, {}, false);
    await this.setAuthToken(r);
  }
}
