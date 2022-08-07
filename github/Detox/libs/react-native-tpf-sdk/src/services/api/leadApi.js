import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetLeadList = params => {
  return utils.get(`${AppConfigs.END_POINT}htf-lead/services/app/LeadEntity/GetLeadList`, params);
};

export const apiCreateOrEditLead = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-lead/services/app/MobileFunction/CreateOrEditForMobile`,
    params
  );
};
export const apiDeleteLead = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-lead/services/app/LeadEntity/DeleteLeadList`,
    params
  );
};

export const apiDeleteLeadForm = params => {
  return utils.delete(`${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/Delete`, params);
};

export const apiUpdateStatusLead = params => {
  return utils.post(`${AppConfigs.END_POINT}htf-lead/services/app/LeadEntity/UpdateStatus`, params);
};

export const apiCreateSDKLead = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-lead/services/app/LeadEntity/CreateSDKLead`,
    params
  );
};

export const apiGetLeadStatusSummary = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-lead/services/app/MobileFunction/GetLeadStatusSummary`,
    params
  );
};
