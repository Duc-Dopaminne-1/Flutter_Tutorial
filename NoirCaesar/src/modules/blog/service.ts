import { api } from '@goldfishcode/noir-caesar-api-sdk';

export const getSlider = async () => {
  try {
    const response = await api.Blog.slider();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getList = async (page?: number, limit?: number) => {
  try {
    const response = await api.Blog.list(page ? page : 1, limit ? limit : 10);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getBlogDetail = async (blog_id: string) => {
  try {
    const response = await api.Blog.detail(blog_id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
