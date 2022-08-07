import reducer from './reducer';
import { Action } from 'redux';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { IBlog } from '@goldfishcode/noir-caesar-api-sdk/libs/api/blog/models';

export enum ActionTypes {
  GET_SLIDER = 'GET_SLIDER',
  SAVE_SLIDERS = 'SAVE_SLIDERS',
  GET_BLOG = 'GET_LIST_BLOG',
  SAVE_BLOG = 'SAVE_LIST_BLOG',
  LOAD_MORE_BLOG = 'LOAD_MORE_BLOG',
  GET_BLOG_DETAIL = 'GET_BLOG_DETAIL',
  SAVE_BLOG_DETAIL = 'SAVE_BLOG_DETAIL',
  RESET_BLOG_DETAIL = 'RESET_BLOG_DETAIL',
}

export interface IBlogState {
  sliders: IBlog[];
  blogList: IPagination<IBlog>;
  detail: IBlog;
}

// Payloads
export interface IActionSaveSliderPayload {
  results: IBlog[];
}

export interface IActionGetBlogPayload extends IActionCallback {
  page?: number;
  limit?: number;
}

export interface IActionSaveBlogPayload {
  results: IPagination<IBlog>;
}

export interface IActionLoadMoreBlogPayload {
  results: IPagination<IBlog>;
}

export interface IActionGetBlogDetailPayload extends IActionCallback {
  blog_id: string;
}

export interface IActionSaveBlogDetailPayload {
  results: IBlog;
}

// Actions
export interface IActionGetSlider extends Action {
  type: ActionTypes.GET_SLIDER;
  payload: IActionCallback;
}

export interface IActionSaveSlider extends Action {
  type: ActionTypes.SAVE_SLIDERS;
  payload: IActionSaveSliderPayload;
}

export interface IActionGetBlog extends Action {
  type: ActionTypes.GET_BLOG;
  payload: IActionGetBlogPayload;
}

export interface IActionSaveBlog extends Action {
  type: ActionTypes.SAVE_BLOG;
  payload: IActionSaveBlogPayload;
}

export interface IActionLoadMoreBlog extends Action {
  type: ActionTypes.LOAD_MORE_BLOG;
  payload: IActionLoadMoreBlogPayload;
}

export interface IActionGetBlogDetail extends Action {
  type: ActionTypes.GET_BLOG_DETAIL;
  payload: IActionGetBlogDetailPayload;
}

export interface IActionSaveBlogDetail extends Action {
  type: ActionTypes.SAVE_BLOG_DETAIL;
  payload: IActionSaveBlogDetailPayload;
}

export interface IActionResetBlogDetail extends Action {
  type: ActionTypes.RESET_BLOG_DETAIL;
}

export type IActionComments =
  | IActionGetSlider
  | IActionSaveSlider
  | IActionGetBlog
  | IActionSaveBlog
  | IActionLoadMoreBlog
  | IActionGetBlogDetail
  | IActionSaveBlogDetail
  | IActionResetBlogDetail
  | IActionResetAllState;

export { reducer };
