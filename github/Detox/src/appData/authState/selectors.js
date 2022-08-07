export const getAuthState = state => state.authState;

export const getAccessToken = state => {
  const authState = getAuthState(state) || {};
  return authState.accessToken;
};

export const getRefreshToken = state => {
  const authState = getAuthState(state) || {};
  return authState.refreshToken;
};
