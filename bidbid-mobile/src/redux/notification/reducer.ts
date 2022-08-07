import { ActionTypes, NotificationAction } from './index';
import { NotificationSetting } from '@/models/notification';
export interface NotificationInit {
  notification: NotificationData;
}

export interface NotificationData {
  data: any;
  page: number;
  isRefresh: boolean;
  unread: number;
  setting: {
    data: NotificationSetting;
    totalEnable: number;
    totalDisable: number;
  };
  isCountDeeplink: number;
  shouldHideLoading: boolean;
}

const initialState: NotificationData = {
  data: [],
  page: 1,
  unread: 0,
  isRefresh: true,
  setting: {
    data: { type: '', value: false },
    totalEnable: 0,
    totalDisable: 0,
  },
  isCountDeeplink: 0,
  shouldHideLoading: false,
};

const reducer = (state: NotificationData = initialState, action: NotificationAction) => {
  switch (action.type) {
    case ActionTypes.GET_NOTIFICATION:
      return {
        ...state,
        page: action.payload.page,
        isRefresh: action.payload.isRefresh,
        shouldHideLoading: true,
      };
    case ActionTypes.INIT_NOTIFICATION:
      return {
        ...state,
        data: action.payload.data,
      };
    case ActionTypes.LOAD_MORE_NOTIFICATION:
      return {
        ...state,
        data: [...state.data, ...action.payload.data],
        page: action.payload.page,
      };
    case ActionTypes.DELETE_ONE:
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.payload.id),
      };
    case ActionTypes.SET_TOTAL_UNREAD:
      return {
        ...state,
        unread: action.payload.unread,
      };
    case ActionTypes.SAVE_NOTIFICATION_SETTING:
      let data = {};
      let totalEnable = 0;
      action.payload.data.map(item => {
        if (item.value) {
          totalEnable++;
        }
        data[item.type] = item.value;
      });
      return {
        ...state,
        setting: {
          data: data,
          totalEnable,
          totalDisable: action.payload.data.length - totalEnable,
        },
      };
    case ActionTypes.SET_STATUS_DEEPLINK:
      return {
        ...state,
        isCountDeeplink: state.isCountDeeplink + 1,
      };
    case ActionTypes.RESET_NOTIFICATION:
      return {
        ...state,
        data: [],
        page: 1,
        unread: 0,
        isRefresh: true,
      };
    case ActionTypes.LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
