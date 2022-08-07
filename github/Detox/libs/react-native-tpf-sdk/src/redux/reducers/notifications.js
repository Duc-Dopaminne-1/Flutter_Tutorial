import { NOTIFICATION } from '../actionsType';

const initialState = {
  generalNotifications: [],
  totalGeneralNotifications: 0,
  totalGeneralUnreadCount: 0,
  changeStatusAction: {},
  isGeneralNotificationLoading: false,
  personalNotifications: [],
  totalPersonalNotifications: 0,
  totalPersonalUnreadCount: 0,
  isPersonalNotificationLoading: false,
  isDeleteNotificationLoading: false,
  deleteNotificationResult: null,
  settingNotification: null,
  promotionResult: {}
};

const notifications = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION.GET_GENERAL_NOTIFICATION_HISTORY.HANDLER: {
      return {
        ...state,
        isGeneralNotificationLoading: true
      };
    }

    case NOTIFICATION.GET_GENERAL_NOTIFICATION_HISTORY.SUCCESS: {
      const { data, isLoadMore } = action.payload;
      return {
        ...state,
        generalNotifications: isLoadMore
          ? [...state.generalNotifications, ...data?.items]
          : Array.from(data?.items),
        totalGeneralNotifications: data?.totalCount,
        totalGeneralUnreadCount: data?.totalUnreadCount,
        isGeneralNotificationLoading: false
      };
    }

    case NOTIFICATION.GET_GENERAL_NOTIFICATION_HISTORY.FAILURE: {
      return {
        ...state,
        isGeneralNotificationLoading: false
      };
    }

    case NOTIFICATION.NOTIFICATION_HISTORY_CHANGE_STATUS.SUCCESS: {
      const { item, idNotification, isChangeAll } = action.payload;

      let newTotalGeneralUnreadCount = state.totalGeneralUnreadCount;
      let newGeneralNotifications = Array.from(state.generalNotifications);

      let newTotalPersonalUnreadCount = state.totalPersonalUnreadCount;
      let newPersonalNotifications = Array.from(state.personalNotifications);

      if (!isChangeAll) {
        switch (item?.key) {
          case 1:
            // In case Personal Notifications
            newTotalPersonalUnreadCount = Math.max(newTotalPersonalUnreadCount - 1, 0);
            newPersonalNotifications.forEach(notify => {
              if (notify?.idNotification === idNotification) {
                notify.status = true;
              }
            });
            break;

          case 2:
            // In case General Notifications
            newTotalGeneralUnreadCount = Math.max(newTotalGeneralUnreadCount - 1, 0);
            newGeneralNotifications.forEach(notify => {
              if (notify?.idNotification === idNotification) {
                notify.status = true;
              }
            });
            break;
          default:
            break;
        }
      } else {
        switch (item?.key) {
          case 1:
            // In case Personal Notifications
            newTotalPersonalUnreadCount = 0;
            newPersonalNotifications.forEach(notify => {
              notify.status = true;
            });
            break;

          case 2:
            // In case General Notifications
            newTotalGeneralUnreadCount = 0;
            newGeneralNotifications.forEach(notify => {
              notify.status = true;
            });
            break;
          default:
            break;
        }
      }

      return {
        ...state,
        changeStatusAction: action.payload.action,
        totalGeneralUnreadCount: newTotalGeneralUnreadCount,
        totalPersonalUnreadCount: newTotalPersonalUnreadCount,
        generalNotifications: newGeneralNotifications,
        personalNotifications: newPersonalNotifications
      };
    }

    case NOTIFICATION.GET_PERSONAL_NOTIFICATION_HISTORY.HANDLER: {
      return {
        ...state,
        isPersonalNotificationLoading: true
      };
    }

    case NOTIFICATION.GET_PERSONAL_NOTIFICATION_HISTORY.SUCCESS: {
      const { data, isLoadMore } = action.payload;
      return {
        ...state,
        personalNotifications: isLoadMore
          ? [...state.personalNotifications, ...data?.items]
          : Array.from(data?.items),
        totalPersonalNotifications: data?.totalCount,
        totalPersonalUnreadCount: data?.totalUnreadCount,
        isPersonalNotificationLoading: false
      };
    }

    case NOTIFICATION.GET_PERSONAL_NOTIFICATION_HISTORY.FAILURE: {
      return {
        ...state,
        isPersonalNotificationLoading: false
      };
    }

    case NOTIFICATION.DELETE_NOTIFICATION_HISTORY.HANDLER: {
      return {
        ...state,
        isDeleteNotificationLoading: true
      };
    }

    case NOTIFICATION.DELETE_NOTIFICATION_HISTORY.SUCCESS: {
      return {
        ...state,
        isDeleteNotificationLoading: false,
        deleteNotificationResult: action.payload
      };
    }

    case NOTIFICATION.DELETE_NOTIFICATION_HISTORY.FAILURE: {
      return {
        ...state,
        isDeleteNotificationLoading: false,
        deleteNotificationResult: action.payload
      };
    }

    case NOTIFICATION.DELETE_NOTIFICATION_HISTORY.CLEAR: {
      return {
        ...state,
        isDeleteNotificationLoading: false,
        deleteNotificationResult: null
      };
    }

    case NOTIFICATION.UPDATE_NOTIFICATION_SETTING.HANDLER: {
      return {
        ...state
      };
    }

    case NOTIFICATION.UPDATE_NOTIFICATION_SETTING.STORE: {
      return {
        ...state,
        settingNotification: action.payload
      };
    }

    case NOTIFICATION.GET_NOTIFICATION_SETTING.SUCCESS: {
      const { notificationSetting } = action.payload;

      return {
        ...state,
        settingNotification: notificationSetting
      };
    }

    case NOTIFICATION.GET_PROMOTION.SUCCESS:
      return {
        ...state,
        promotionResult: action.payload
      };

    case NOTIFICATION.GET_PROMOTION.CLEAR:
      return {
        ...state,
        promotionResult: {}
      };

    default:
      return state;
  }
};

export default notifications;
