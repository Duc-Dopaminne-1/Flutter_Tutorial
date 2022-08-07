import { ActionTypes, IActionGetPageContentPayload, IActionSavePageContentPayload } from './index';

const getPageContent = (payload: IActionGetPageContentPayload) => ({
  type: ActionTypes.GET_PAGE_CONTENT,
  payload,
});

const savePageContent = (payload: IActionSavePageContentPayload) => ({
  type: ActionTypes.SAVE_PAGE_CONTENT,
  payload,
});

export { getPageContent, savePageContent };
