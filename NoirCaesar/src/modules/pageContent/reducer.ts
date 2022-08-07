import { ActionTypes, IActionPageContent } from './index';
import { IPageContent } from '@goldfishcode/noir-caesar-api-sdk/libs/api/page_content/models';
import { PageTypeListEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/page_content';
import { CommonActionType } from '../base';

export interface IPageContentState {
  about: IPageContent;
  tos: IPageContent;
  policy: IPageContent;
  copyright: IPageContent;
}

const initialState: IPageContentState = {
  about: {
    id: '',
    title: '',
    content: '',
  },
  tos: {
    id: '',
    title: '',
    content: '',
  },
  policy: {
    id: '',
    title: '',
    content: '',
  },
  copyright: {
    id: '',
    title: '',
    content: '',
  },
};

const reducer = (state: IPageContentState = initialState, action: IActionPageContent) => {
  switch (action.type) {
    case ActionTypes.SAVE_PAGE_CONTENT:
      switch (action.payload.type) {
        case PageTypeListEnum.About:
          return {
            ...state,
            about: action.payload.results,
          };
        case PageTypeListEnum.TOS:
          return {
            ...state,
            tos: action.payload.results,
          };
        case PageTypeListEnum.Policy:
          return {
            ...state,
            policy: action.payload.results,
          };
        case PageTypeListEnum.Copyright:
          return {
            ...state,
            copyright: action.payload.results,
          };
      }
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
