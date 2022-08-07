import { ApiClient, api } from '@reup/reup-api-sdk';
import { IApiResponse, IGetCurrentUser, IIsAuthenticated, IRefreshToken, ILogout, IActionLoginApplePayload } from './index';
import { UserRegisterParams, SocialLoginParams } from '@reup/reup-api-sdk/libs/api/auth/adapter/adapter';
import { UserProfileParams } from '@reup/reup-api-sdk/libs/api/user';
import { IUser, IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
export const wait = (time: number) => new Promise(rs => setTimeout(rs, time));

export const login: any = async (email: string, password: string) => {
  try {
    const response = await api.Auth.login(email, password);
    return { value: response, error: null };
  } catch (error) {
    console.log(error);
    return { value: null, error };
  }
};

export const loginWithGoogle = async (accessToken: string) => {
  try {
    const response = await api.Auth.googleLogin({ access_token: accessToken });
    console.log(response);
    return { value: response, error: null };
  } catch (error) {
    console.log(error);
    return { value: null, error: error };
  }
};

export const loginWithFacebook = async (accessToken: string) => {
  try {
    const response = await api.Auth.facebookLogin({ access_token: accessToken });
    console.log(response);
    return { value: response, error: null };
  } catch (error) {
    console.log(error);
    return { value: null, error: error };
  }
};

export const logout: ILogout = async () => {
  const response = await api.Auth.logout();
  return response;
};

export const isAuthenticated: IIsAuthenticated = async () => {
  const status = await api.Auth.isAuthenticated();
  return status;
};

export const getCurrentUser: IGetCurrentUser = async () => {
  try {
    const user = await api.User.profile();
    const response: IApiResponse<IUserProfile> = {
      value: user,
    };
    return response;
  } catch (error) {
    return { error };
  }
};

export const register = async (body: UserRegisterParams) => {
  try {
    const response = await api.Auth.register(body);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const response = await api.Auth.resetPassword(email);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const confirmOTP = async (email: string, otp: string, newPassword: string) => {
  try {
    const response = await api.Auth.resetPasswordConfirm(newPassword, otp, email);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    // const response = await api.Auth.changePassword(newPassword);
    return {
      result: '',
    };
  } catch (error) {
    return { error };
  }
};

export const updateProfile = async (data: UserProfileParams) => {
  try {
    const response = await api.User.updateProfile(data);
    return {
      result: response,
    };
  } catch (error) {
    console.log(error);
    return { error };
  }
};


export const uploadImage = async (data: FormData, progress: (percent: number) => void) => {
  try {
    const response = await api.UploadFile.uploadImage(data, progress);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const refreshToken: IRefreshToken = async () => {
  try {
    await api.Auth.refreshToken();
    return { result: true };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const loginWithApple = async (data: SocialLoginParams) => {
  try {
    const response = await api.Auth.appleLogin(data);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error: error };
  }
};
