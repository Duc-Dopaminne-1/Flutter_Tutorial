import { AppState, AppActionType, AppAction } from '@/redux/app/index';

export interface AppInit {
  app: AppState;
  setting: any;
}

const initialState: AppState = {
  status: AppActionType.MOUNTED,
  setting: {
    AUCTION_START_PRICE: 25,
    MINIMUM_CONDITION_LIKES: 25,
    USER_MAX_DISTANCE: 10,
    FILE_PRIVACY_POLICY: '',
    FILE_SAFETY_POLICY: '',
    FILE_TERM_OF_SERVICE: '',
    IS_FIRST_INSTALL: false,
    IS_FIRST_REVIEW: false,
    IS_FIRST_MEET_GREAT_PERSON: false,
    IS_FIRST_MEET_GREAT_VIRTUAL: false,
    APP_VERSION_MINIMUM: '',
    APP_VERSION_CURRENT: '',
    AUCTION_START_PRICE_BY_COUNTRY: [],
  },
  isEnableLocation: true,
  locale: null,
};

const reducer = (state: AppState = initialState, action: AppAction): AppState => {
  switch (action.type) {
    case AppActionType.INITED:
      return {
        ...state,
        status: AppActionType.INITED,
      };
    case AppActionType.READY:
      return {
        ...state,
        status: AppActionType.READY,
      };
    case AppActionType.SAVE_SETTING_DEFAULT:
      return {
        ...state,
        setting: action.payload.data,
      };
    case AppActionType.UPDATE_SETTING_DEFAULT:
      return {
        ...state,
        setting: {
          ...state.setting,
          IS_FIRST_INSTALL: action.payload.data,
        },
      };
    case AppActionType.UPDATE_SETTING_REVIEW:
      return {
        ...state,
        setting: {
          ...state.setting,
          IS_FIRST_REVIEW: action.payload.data,
        },
      };
    case AppActionType.UPDATE_SETTING_MEET_GREAT_PERSON:
      return {
        ...state,
        setting: {
          ...state.setting,
          IS_FIRST_MEET_GREAT_PERSON: action.payload.data,
        },
      };
    case AppActionType.UPDATE_SETTING_MEET_GREAT_VIRTUAL:
      return {
        ...state,
        setting: {
          ...state.setting,
          IS_FIRST_MEET_GREAT_VIRTUAL: action.payload.data,
        },
      };
    case AppActionType.LOG_OUT:
      return {
        ...initialState,
        locale: state.locale,
      };

    case AppActionType.SET_PERMISSION_LOCATION:
      return {
        ...state,
        isEnableLocation: action.payload.isEnable,
      };

    case AppActionType.CHANGE_LOCALE:
      return {
        ...state,
        locale: action.payload.locale,
      };
    default:
      return state;
  }
};

export default reducer;
