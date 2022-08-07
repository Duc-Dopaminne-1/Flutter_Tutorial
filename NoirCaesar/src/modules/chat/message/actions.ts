import {
  ActionTypes,
  IActionGetMessageListPayload,
  IActionSaveMessageListPayload,
  IActionGetMessageDetailPayload,
  IActionSaveMessageDetailPayload,
  IActionSendMessagePayload,
  IActionUpdateMessagePayload,
  IActionDeleteMessagePayload,
  IActionMarkReadMessagePayload,
  IActionSaveSentMessagePayload,
  IActionSaveUpdatedMessagePayload,
  IActionSaveDeletedMessagePayload,
  IActionSaveImageSizePayload,
} from './index';

const getMessageList = (payload: IActionGetMessageListPayload) => ({
  type: ActionTypes.GET_MESSAGE_LIST,
  payload,
});

const saveMessageList = (payload: IActionSaveMessageListPayload) => ({
  type: ActionTypes.SAVE_MESSAGE_LIST,
  payload,
});

const loadMoreMessageList = (payload: IActionSaveMessageListPayload) => ({
  type: ActionTypes.LOAD_MORE_MESSAGE_LIST,
  payload,
});

const getMessageDetail = (payload: IActionGetMessageDetailPayload) => ({
  type: ActionTypes.GET_MESSAGE_DETAIL,
  payload,
});

const saveMessageDetail = (payload: IActionSaveMessageDetailPayload) => ({
  type: ActionTypes.SAVE_MESSAGE_DETAIL,
  payload,
});

const sendMessage = (payload: IActionSendMessagePayload) => ({
  type: ActionTypes.SEND_MESSAGE,
  payload,
});

const saveSentMessage = (payload: IActionSaveSentMessagePayload) => ({
  type: ActionTypes.SAVE_SENT_MESSAGE,
  payload,
});

const updateMessage = (payload: IActionUpdateMessagePayload) => ({
  type: ActionTypes.UPDATE_MESSAGE,
  payload,
});

const saveUpdatedMessage = (payload: IActionSaveUpdatedMessagePayload) => ({
  type: ActionTypes.SAVE_UPDATED_MESSAGE,
  payload,
});

const deleteMessage = (payload: IActionDeleteMessagePayload) => ({
  type: ActionTypes.DELETE_MESSAGE,
  payload,
});

const saveDeletedMessage = (payload: IActionSaveDeletedMessagePayload) => ({
  type: ActionTypes.SAVE_DELETED_MESSAGE,
  payload,
});

const markReadMessage = (payload: IActionMarkReadMessagePayload) => ({
  type: ActionTypes.MARK_READ_MESSAGE,
  payload,
});

const saveImageSize = (payload: IActionSaveImageSizePayload) => ({
  type: ActionTypes.SAVE_IMAGE_SIZE,
  payload,
})

export {
  getMessageList,
  saveMessageList,
  loadMoreMessageList,
  getMessageDetail,
  saveMessageDetail,
  sendMessage,
  saveSentMessage,
  updateMessage,
  saveUpdatedMessage,
  deleteMessage,
  saveDeletedMessage,
  markReadMessage,
  saveImageSize
};
