import { api } from "@goldfishcode/noir-caesar-api-sdk";
import { CategoryCollectionEnum } from "@goldfishcode/noir-caesar-api-sdk/libs/api/user";

export const getProfile = async (user_id: string) => {
  try {
    const response = await api.User.getProfile(user_id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const listRetrieveCollection = async (user_id: string, type: CategoryCollectionEnum, page?: number, limit?: number) => {
  try {
    const response = await api.User.listRetrieveCollection(user_id, type, page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const followUser = async (user_id: string) => {
  try {
    const response = await api.User.followUser(user_id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const unfollowUser = async (user_id: string) => {
  try {
    const response = await api.User.unfollowUser(user_id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
