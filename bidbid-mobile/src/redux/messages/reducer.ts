import { ActionTypes, MessagesAction } from './index';
import _ from 'lodash';
import moment from 'moment';

export interface MessageInit {
  message: PaymentData;
}

export interface PaymentData {
  rooms: any[];
  chat: any;
  roomsHistory: any[];
  chatBackup: any;
  totalUnread: number;
}

const initialState: PaymentData = {
  rooms: [],
  chat: {},
  roomsHistory: [],
  chatBackup: {},
  totalUnread: 0,
};

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return srcValue.concat(objValue);
  }
}

function customizerOnTop(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

function filterDouble(data, newData) {
  for (let i = 0; i < newData.length; i++) {
    let newEvent = newData[i];
    for (let j = 0; j < data.length; j++) {
      let origEvent = data[j];
      if (newEvent.id == origEvent.id) {
        data.splice(j, 1, newEvent);
        break;
      } else if (j === data.length - 1) {
        data.push(newEvent);
        break;
      }
    }
  }
  return data;
}
const reducer = (state: PaymentData = initialState, action: MessagesAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_LIST_ROOM:
      const listRoom = action.payload.data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return moment(new Date(b.updatedAt)) - moment(new Date(a.updatedAt));
      });

      if (action.payload.isLoadMore) {
        return {
          ...state,
          rooms: filterDouble(state.rooms, listRoom),
        };
      }

      return {
        ...state,
        rooms: listRoom,
      };
    case ActionTypes.UPDATE_LIST_ROOM:
      let merged = state.rooms.filter(item => item.id !== action.payload.data[0].id);
      merged.unshift(action.payload.data[0]);
      return {
        ...state,
        rooms: merged,
      };
    case ActionTypes.UPDATE_ROOM_READ_MESSAGE:
      let result = state.rooms.findIndex(item => item.id === action.payload.roomId);
      state.rooms[result].unread = 0;
      return {
        ...state,
        rooms: state.rooms.concat([]),
      };
    // save message when receive socket
    case ActionTypes.SAVE_MESSAGES:
      if (state.chatBackup.hasOwnProperty(action.payload.roomId)) {
        const index = state.chatBackup[action.payload.roomId].findIndex(item => item._id === action.payload.data[0]._id);
        if (index > -1) {
          return state;
        }
      }
      const chatData = {
        chat: {
          [action.payload.roomId]: action.payload.data,
        },
      };
      return _.mergeWith(state, chatData, customizer);
    // load message when into detail chat
    case ActionTypes.INIT_MESSAGES:
      return {
        ...state,
        chat: {
          ...state.chat,
          [action.payload.roomId]: action.payload.data,
        },
      };
    case ActionTypes.SAVE_MESSAGES_ON_TOP:
      const loadMessage = {
        chat: {
          [action.payload.roomId]: action.payload.data,
        },
      };
      return _.mergeWith(state, loadMessage, customizerOnTop);
    case ActionTypes.SAVE_TOTAL_UNREAD_MESSAGE:
      return {
        ...state,
        totalUnread: action.payload.total,
      };
    // save message when receive socket to filter delicate
    case ActionTypes.SAVE_BACKUP_MESSAGES:
      const roomData = state.chatBackup[action.payload.roomId] ? state.chatBackup[action.payload.roomId] : [];
      return {
        ...state,
        chatBackup: {
          [action.payload.roomId]: [...roomData, ...action.payload.data],
        },
      };
    case ActionTypes.SAVE_LIST_ROOM_HISTORY:
      const listRoomHistory = action.payload.data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return moment(new Date(b.updatedAt)) - moment(new Date(a.updatedAt));
      });

      if (action.payload.isLoadMore) {
        return {
          ...state,
          roomsHistory: filterDouble(state.roomsHistory, listRoomHistory),
        };
      }
      return {
        ...state,
        roomsHistory: listRoomHistory,
      };
    case ActionTypes.LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
