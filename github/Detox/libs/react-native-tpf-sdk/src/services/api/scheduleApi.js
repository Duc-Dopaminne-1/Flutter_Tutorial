import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetListSchedule = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-schedule/services/app/Schedule/GetScheduleList`,
    params
  );
};

export const apiCreateEditSchedule = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-schedule/services/app/Schedule/CreateOrEdit`,
    params
  );
};

export const apiDeleteSchedule = params => {
  return utils.post(`${AppConfigs.END_POINT}htf-schedule/services/app/Schedule/DeleteList`, params);
};

export const apiGetScheduleDetail = id => {
  return utils.get(`${AppConfigs.END_POINT}htf-schedule/services/app/Schedule/GetById`, {
    id
  });
};

export const apiUpdateScheduleStatus = params => {
  return utils.put(
    `${AppConfigs.END_POINT}htf-schedule/services/app/Schedule/UpdateScheduleStatus`,
    params
  );
};

export const exportFile = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetServiceConfirmPdf`,
    params
  );
};
