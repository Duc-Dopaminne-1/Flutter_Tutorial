import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetAllNotifications = params => {
  return utils.get(`${AppConfigs.END_POINT}api/NotificationHistory/GetAllByMemberCode`, params);
};

export const apiDeleteNotification = params => {
  return utils.post(`${AppConfigs.END_POINT}api/NotificationHistory/Delete`, params);
};

export const apiReadNotification = params => {
  return utils.post(`${AppConfigs.END_POINT}api/NotificationHistory/ChangeStatus`, params);
};

export const apiNotificationSetting = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-notification/services/app/NotificationSetting/GetByMemberId`,
    params
  );
};

export const apiUpdateNotificationSetting = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-notification/services/app/NotificationSetting/CreateOrEdit`,
    params
  );
};

export const apiGetAllNotificationHistory = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-notification/services/app/NotificationHistory/GetAll`,
    params
  );
};

export const apiChangeStatusNotificationHistory = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-notification/services/app/NotificationHistory/ChangeStatus`,
    params
  );
};

export const apiDeleteNotificationHistory = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-notification/services/app/NotificationHistory/Delete`,
    params
  );
};

export const apiGetPromotion = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-notification/services/app/NotificationHistory/GetAllPopupNotification`,
    params
  );
};
