import jwtDecode from 'jwt-decode';

const decodeJwtToken = token => {
  if (!token) {
    return null;
  }

  return jwtDecode(token);
};

export {decodeJwtToken};
