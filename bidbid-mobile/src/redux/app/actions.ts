import {
  AppActionType,
  AppActionInit,
  AppActionReady,
  AppActionInited,
  AppGetSettingDefault,
  AppSaveSettingDefault,
  AppSaveSettingDefaultPayload,
  AppActionSetPermissionLocation,
  AppUpdateSettingDefault,
  AppUpdateSettingDefaultPayload,
  AppUpdateSettingReview,
  AppUpdateSettingReviewPayload,
  AppActionChangeLocale,
  AppUpdateSettingMeetGreatVirtualPayload,
  AppUpdateSettingMeetGreatVirtual,
  AppUpdateSettingMeetGreatPerson,
  AppUpdateSettingMeetGreatPersonPayload,
  AppGetCountryCode,
  AppGetCountryCodePayload,
} from '@/redux/app/index';

export const init = (): AppActionInit => {
  return {
    type: AppActionType.INIT,
  };
};

export const inited = (payload: any): AppActionInited => {
  return {
    type: AppActionType.INITED,
    payload,
  };
};

export const ready = (): AppActionReady => {
  return {
    type: AppActionType.READY,
  };
};

export const getSetting = (): AppGetSettingDefault => {
  return {
    type: AppActionType.GET_SETTING_DEFAULT,
  };
};

export const saveSetting = (payload: AppSaveSettingDefaultPayload): AppSaveSettingDefault => {
  return {
    type: AppActionType.SAVE_SETTING_DEFAULT,
    payload,
  };
};

export const updateSetting = (payload: AppUpdateSettingDefaultPayload): AppUpdateSettingDefault => {
  return {
    type: AppActionType.UPDATE_SETTING_DEFAULT,
    payload,
  };
};

export const updateSettingReview = (payload: AppUpdateSettingReviewPayload): AppUpdateSettingReview => {
  return {
    type: AppActionType.UPDATE_SETTING_REVIEW,
    payload,
  };
};

export const getCountryCode = (payload: AppGetCountryCodePayload): AppGetCountryCode => {
  return {
    type: AppActionType.GET_COUNTRY_CODE,
    payload,
  };
};

export const updateSettingMeetGreatPerson = (payload: AppUpdateSettingMeetGreatPersonPayload): AppUpdateSettingMeetGreatPerson => {
  return {
    type: AppActionType.UPDATE_SETTING_MEET_GREAT_PERSON,
    payload,
  };
};

export const updateSettingMeetGreatVirtual = (payload: AppUpdateSettingMeetGreatVirtualPayload): AppUpdateSettingMeetGreatVirtual => {
  return {
    type: AppActionType.UPDATE_SETTING_MEET_GREAT_VIRTUAL,
    payload,
  };
};

export const setPermissionLocation = (isEnable: boolean): AppActionSetPermissionLocation => {
  return {
    type: AppActionType.SET_PERMISSION_LOCATION,
    payload: {
      isEnable,
    },
  };
};

export const changeLocale = (locale: string): AppActionChangeLocale => {
  return {
    type: AppActionType.CHANGE_LOCALE,
    payload: {
      locale,
    },
  };
};
