import { Auth } from '@/services';
import { ActionSaveProfilePayload } from './index';

export const createProfile = async (param: ActionSaveProfilePayload) => {
  try {
    const response = await Auth.createProfile(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
