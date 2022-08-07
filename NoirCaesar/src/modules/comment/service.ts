import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { ModelEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment';

export const getList = async (model: ModelEnum, model_id: string, page?: number, limit?: number) => {
  try {
    const response = await api.Comment.list(model, model_id, page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const createComment = async (model: ModelEnum, model_id: string, text: string) => {
  try {
    const response = await api.Comment.create(model, model_id, text);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
