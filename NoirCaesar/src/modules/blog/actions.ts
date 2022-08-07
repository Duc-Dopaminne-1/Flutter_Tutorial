import {
  ActionTypes,
  IActionGetBlogPayload,
  IActionSaveBlogPayload,
  IActionLoadMoreBlogPayload,
  IActionSaveSliderPayload,
  IActionGetBlogDetailPayload,
  IActionSaveBlogDetailPayload,
} from './index';
import { IActionCallback } from '@src/models/callback';

const getSlider = (payload: IActionCallback) => ({
  type: ActionTypes.GET_SLIDER,
  payload,
});

const saveSlider = (payload: IActionSaveSliderPayload) => ({
  type: ActionTypes.SAVE_SLIDERS,
  payload,
});

const getBlog = (payload: IActionGetBlogPayload) => ({
  type: ActionTypes.GET_BLOG,
  payload,
});

const saveBlog = (payload: IActionSaveBlogPayload) => ({
  type: ActionTypes.SAVE_BLOG,
  payload,
});

const loadMoreBlog = (payload: IActionLoadMoreBlogPayload) => ({
  type: ActionTypes.LOAD_MORE_BLOG,
  payload,
});

const getBlogDetail = (payload: IActionGetBlogDetailPayload) => ({
  type: ActionTypes.GET_BLOG_DETAIL,
  payload,
});

const saveBlogDetail = (payload: IActionSaveBlogDetailPayload) => ({
  type: ActionTypes.SAVE_BLOG_DETAIL,
  payload,
});

const resetBlogDetail = () => ({
  type: ActionTypes.RESET_BLOG_DETAIL,
});

export { getSlider, saveSlider, getBlog, saveBlog, loadMoreBlog, getBlogDetail, saveBlogDetail, resetBlogDetail };
