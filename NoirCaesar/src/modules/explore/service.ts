import { api } from '@goldfishcode/noir-caesar-api-sdk';

export const episodeList = async (story_id: string, page?: number, limit?: number) => {
  try {
    const response = await api.Tv.episodeList(story_id, page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const listExplore = async (name: string, page?: number, limit?: number) => {
  try {
    const response = await api.Explore.listExplore(name, page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getExploreSlider = async () => {
  try {
    const response = await api.Explore.listHomeSlider();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
