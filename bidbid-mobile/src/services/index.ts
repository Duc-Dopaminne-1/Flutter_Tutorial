import { ApiClient } from './http/client';
import { JwtAuth } from './auth/jwt';

const Auth = new JwtAuth();
ApiClient.setAuthenticator(Auth);

export { Auth };
