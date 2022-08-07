import {
  ActionTypes,
  IActionGetlistCommentPayload,
  IActionSaveListCommentPayload,
  IActionCreateCommentPayload,
  IActionLoadMoreListCommentPayload,
} from './index';

const getListComment = (payload: IActionGetlistCommentPayload) => ({
  type: ActionTypes.GET_LIST_COMMENT,
  payload,
});

const createComment = (payload: IActionCreateCommentPayload) => ({
  type: ActionTypes.CREATE_COMMENT,
  payload,
});

const saveListComment = (payload: IActionSaveListCommentPayload) => ({
  type: ActionTypes.SAVE_LIST_COMMENT,
  payload,
});

const loadMoreListComment = (payload: IActionLoadMoreListCommentPayload) => ({
  type: ActionTypes.LOAD_MORE_LIST_COMMENT,
  payload,
});

export { getListComment, createComment, saveListComment, loadMoreListComment };
