export const ROLE_NAME_AGENT = 'agent';
export const ROLE_NAME_MEMBER = 'member';

export const getUser = state => state.user || {};
export const getUserName = state => {
  const user = getUser(state);
  return user.username;
};

export const getUserRole = state => {
  const user = getUser(state);
  return user.role;
};

export const getUserId = state => {
  const user = getUser(state);
  return user.id;
};

export const getUserEmail = state => {
  const user = getUser(state);
  return user.email;
};

export const getPushNotificationId = state => {
  const user = getUser(state);
  return user.pushNotificationId;
};

export const isFirstLogin = state => {
  const user = getUser(state);
  return user.isFirstLogin;
};

export function isAgent(state) {
  const role = getUserRole(state);
  return !!role && role === ROLE_NAME_AGENT;
}

export function isMember(state) {
  const role = getUserRole(state);
  return !!role && role === ROLE_NAME_MEMBER;
}
