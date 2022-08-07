import reducer from './reducer';
import { Action } from 'redux';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { PageTypeListEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/page_content';
import { IPageContent } from '@goldfishcode/noir-caesar-api-sdk/libs/api/page_content/models';

export enum ActionTypes {
  GET_PAGE_CONTENT = 'GET_PAGE_CONTENT',
  SAVE_PAGE_CONTENT = 'SAVE_PAGE_CONTENT',
}

// Payloads
export interface IActionGetPageContentPayload extends IActionCallback {
  page_type: PageTypeListEnum;
}

export interface IActionSavePageContentPayload {
  type: PageTypeListEnum;
  results: IPageContent;
}

// Actions
export interface IActionGetPageContent extends Action {
  type: ActionTypes.GET_PAGE_CONTENT;
  payload: IActionGetPageContentPayload;
}

export interface IActionSavePageContent extends Action {
  type: ActionTypes.SAVE_PAGE_CONTENT;
  payload: IActionSavePageContentPayload;
}

export type IActionPageContent = IActionGetPageContent | IActionSavePageContent | IActionResetAllState;

export { reducer };
