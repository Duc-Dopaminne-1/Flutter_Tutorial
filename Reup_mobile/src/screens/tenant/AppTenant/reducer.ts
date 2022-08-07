import { AppActionType, AppStatus, IAppAction, IAppState } from '@models/app';

const initialState: IAppState = {
  status: AppStatus.MOUNTED,
  newVersion: false,
  supported: false,
  data: {},
};

const reducer = (state: IAppState = initialState, action: IAppAction): IAppState => {
  switch (action.type) {
    case AppActionType.INIT:
      return {
        ...state,
        status: AppStatus.INITING,
      };
    case AppActionType.INITED:
      return {
        ...state,
        status: AppStatus.INITED,
        newVersion: action.payload.newVersion,
        supported: action.payload.supported,
        ...state.data,
        ...action.payload,
      };
    case AppActionType.LOAD_DATA:
      return {
        ...state,
        status: AppStatus.LOADING,
      };
    case AppActionType.LOADED_DATA:
      return {
        ...state,
        status: AppStatus.LOADED,
        data: {
          ...state.data,
          ...action.payload,
        },
      };
    case AppActionType.TRY_AUTH:
      return {
        ...state,
        status: AppStatus.TRY_AUTH,
      };
    case AppActionType.TRY_AUTH_DONE:
      return {
        ...state,
        status: AppStatus.TRY_AUTH_DONE,
      };
    case AppActionType.LOG_OUT:
      return {
        ...state,
        status: AppStatus.NOT_AUTH,
      };
    default:
      return state;
  }
};

export default reducer;
