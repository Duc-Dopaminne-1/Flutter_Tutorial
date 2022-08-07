import {
  ActionGetListRoom,
  ActionGetListRoomHistory,
  ActionGetListRoomHistoryPayload,
  ActionGetListRoomPayload,
  ActionGetMessages,
  ActionGetMessagesPayload,
  ActionGetTotalUnread,
  ActionInitMessages,
  ActionInitMessagesPayload,
  ActionLoadMoreMessage,
  ActionLoadMoreMessagePayload,
  ActionSaveBackupMessages,
  ActionSaveBackupMessagesPayload,
  ActionSaveListRoom,
  ActionSaveListRoomHistory,
  ActionSaveListRoomHistoryPayload,
  ActionSaveListRoomPayload,
  ActionSaveMessages,
  ActionSaveMessagesOnTop,
  ActionSaveMessagesOnTopPayload,
  ActionSaveMessagesPayload,
  ActionSaveTotalUnread,
  ActionSaveTotalUnreadPayload,
  ActionTypes,
  ActionUpdateListRoom,
  ActionUpdateListRoomPayload,
  ActionUpdateRoomMessage,
  ActionUpdateRoomMessagePayload,
} from './index';

export function getMessages(payload: ActionGetMessagesPayload): ActionGetMessages {
  return {
    type: ActionTypes.GET_MESSAGES,
    payload,
  };
}

export function saveBackupMessages(payload: ActionSaveBackupMessagesPayload): ActionSaveBackupMessages {
  return {
    type: ActionTypes.SAVE_BACKUP_MESSAGES,
    payload,
  };
}

export function saveMessages(payload: ActionSaveMessagesPayload): ActionSaveMessages {
  return {
    type: ActionTypes.SAVE_MESSAGES,
    payload,
  };
}

export function initMessages(payload: ActionInitMessagesPayload): ActionInitMessages {
  return {
    type: ActionTypes.INIT_MESSAGES,
    payload,
  };
}

export function saveMessagesOnTop(payload: ActionSaveMessagesOnTopPayload): ActionSaveMessagesOnTop {
  return {
    type: ActionTypes.SAVE_MESSAGES_ON_TOP,
    payload,
  };
}

export function updateListRoom(payload: ActionUpdateListRoomPayload): ActionUpdateListRoom {
  return {
    type: ActionTypes.UPDATE_LIST_ROOM,
    payload,
  };
}

export function getListRoom(payload: ActionGetListRoomPayload): ActionGetListRoom {
  return {
    type: ActionTypes.GET_LIST_ROOM,
    payload,
  };
}

export function saveListRoom(payload: ActionSaveListRoomPayload): ActionSaveListRoom {
  return {
    type: ActionTypes.SAVE_LIST_ROOM,
    payload,
  };
}

export function updateRoomReadMessage(payload: ActionUpdateRoomMessagePayload): ActionUpdateRoomMessage {
  return {
    type: ActionTypes.UPDATE_ROOM_READ_MESSAGE,
    payload,
  };
}

export function loadMoreMessage(payload: ActionLoadMoreMessagePayload): ActionLoadMoreMessage {
  return {
    type: ActionTypes.LOAD_MORE_MESSAGE,
    payload,
  };
}

export function getTotalUnread(): ActionGetTotalUnread {
  return {
    type: ActionTypes.GET_TOTAL_UNREAD_MESSAGE,
  };
}

export function saveTotalUnread(payload: ActionSaveTotalUnreadPayload): ActionSaveTotalUnread {
  return {
    type: ActionTypes.SAVE_TOTAL_UNREAD_MESSAGE,
    payload,
  };
}

export function getListRoomHistory(payload: ActionGetListRoomHistoryPayload): ActionGetListRoomHistory {
  return {
    type: ActionTypes.GET_LIST_ROOM_HISTORY,
    payload,
  };
}

export function saveListRoomHistory(payload: ActionSaveListRoomHistoryPayload): ActionSaveListRoomHistory {
  return {
    type: ActionTypes.SAVE_LIST_ROOM_HISTORY,
    payload,
  };
}
