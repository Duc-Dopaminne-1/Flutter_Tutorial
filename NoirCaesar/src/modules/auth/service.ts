import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { UserRegisterParams } from '@goldfishcode/noir-caesar-api-sdk/libs/api/auth/adapter/adapter';
import { UserProfileParams, CategoryCollectionEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user';
import { CreateStoryData } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv';
import { PreSignedUrlParam } from '@goldfishcode/noir-caesar-api-sdk/libs/api/upload/adapter/adapter';

export const login: any = async (email: string, password: string) => {
  try {
    const response = await api.Auth.login(email, password);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const logout = async () => {
  try {
    const response = await api.Auth.logout();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getAuthToken = async () => {
  try {
    const response = await api.Auth.getAuthToken();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const isAuthenticated = async () => {
  try {
    const response = await api.Auth.isAuthenticated();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.User.me();
    return {
      result: response,
    };
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

export const updatePassword = async (newPassword: string) => {
  try {
    const response = await api.Auth.changePassword(newPassword);
    return {
      result: response,
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
    return { error };
  }
};

export const refreshToken = async () => {
  try {
    await api.Auth.refreshToken();
    return true;
  } catch (error) {
    return { error };
  }
};

export const uploadCollection = async (file: any, presignedPost: PreSignedUrlParam, callback?: (percentage: number) => void) => {
  try {
    const response = await api.UploadFile.upload(file, presignedPost, callback);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const uploadVideoOrAudio = async (data: CreateStoryData) => {
  try {
    const response = await api.Tv.createStory(data);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const listCollection = async (type: CategoryCollectionEnum, page?: number, limit?: number) => {
  try {
    const response = await api.User.listCollection(type, page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getPersonTypes = async () => {
  try {
    const response = await api.User.getPersonTypes();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
