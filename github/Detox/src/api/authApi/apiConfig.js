import Configs from '../../configs';

const apiConfig = {
  baseURL: Configs.auth.AUTH_URL,
  token: Configs.oidc.OIDC_SERVICE_TOKEN_ENDPOINT,
  refresh: Configs.oidc.OIDC_SERVICE_TOKEN_ENDPOINT,
  logout: Configs.oidc.OIDC_SERVICE_REVOCATION_ENDPOINT,
};

export default apiConfig;
