import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';
export const apiGetEvents = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-cms/services/app/CmsEvent/GetEventsByCategory`,
    params
  );
};
export const apiGetEventDetail = params => {
  return utils.get(`${AppConfigs.END_POINT}htf-cms/services/app/CmsEvent/GetEventForEdit`, params);
};
