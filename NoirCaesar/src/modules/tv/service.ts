import { api } from '@goldfishcode/noir-caesar-api-sdk';

export const getCategories = async () => {
  try {
    const response = await api.Tv.categories();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getSlider = async (cate_id?: string) => {
  try {
    const response = await api.Tv.slider(cate_id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getStories = async (cate_id: string, page?: number, limit?: number) => {
  try {
    const response = await api.Tv.stories(cate_id, undefined, page, limit);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const detailStory = async (story_id: string, is_collection?: boolean) => {
  try {
    const response = await api.Tv.detailStory(story_id, is_collection ?? false);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getEpisodeDetail = async (episode_id: string, is_collection?: boolean) => {
  try {
    const response = await api.Tv.detailEpisode(episode_id, is_collection);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getSuggestEpisode = async (episode_id: string, page?: number, limit?: number) => {
  try {
    const response = await api.Tv.suggestEpisode(episode_id, page, limit);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const purchaseEpisode = async (episode_id: string) => {
  try {
    const response = await api.Tv.purchaseEpisode(episode_id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
