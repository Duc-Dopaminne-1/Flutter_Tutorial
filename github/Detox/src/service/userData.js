import {decodeJwtToken} from '../utils/jsonwebtoken';

const ROLE_NAME = {
  AGENT: 'agent',
  MEMBER: 'member',
};

const parseUserInfo = authState => {
  if (!authState) {
    return;
  }

  const accessToken = authState.accessToken;
  if (!accessToken) {
    return;
  }

  const tokenData = decodeJwtToken(accessToken);
  if (!tokenData) {
    return;
  }

  const id = tokenData.sub;
  const role = tokenData.role;
  const email = tokenData.email;
  const isAgent = !!role && role === ROLE_NAME.AGENT;
  const isFirstLogin = tokenData.firstlogin;

  return {id, isAgent, isFirstLogin, role, email};
};

const parseUserData = data => {
  const {access_token, expires_in, refresh_token, scope} = data;
  const now = Date.now();
  const expiredTimeStamp = now + expires_in;
  const authState = {
    hasLoggedInOnce: true,
    accessToken: access_token,
    accessTokenExpirationDate: expiredTimeStamp,
    refreshToken: refresh_token,
    scope,
  };

  const user = parseUserInfo(authState);
  return {authState, user};
};

const isAllowedLoginRole = roleName => {
  const allowed = roleName && (roleName === ROLE_NAME.AGENT || roleName === ROLE_NAME.MEMBER);
  return allowed;
};

export {isAllowedLoginRole, parseUserData};
