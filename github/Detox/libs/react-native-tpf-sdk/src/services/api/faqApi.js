import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';
export const apiGetListOfFAQ = params => {
  return utils.get(`${AppConfigs.END_POINT}htf-cms/services/app/CmsCategory/GetAll`, params);
};

export const apiGetFAQDetailsList = params => {
  return utils.get(`${AppConfigs.END_POINT}htf-cms/services/app/CmsFAQ/GetFAQsByCategory`, params);
};

export const apiCreateFAQSupport = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-cms/services/app/CmsFAQSupport/RequestSupportForMember`,
    params
  );
};

export const apiGetListFAQSupport = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-cms/services/app/CmsFAQSupport/GetAllSupportRequest`,
    params
  );
};

export const apiGetFAQSupportDetail = id => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-cms/services/app/CmsFAQSupport/GetSupportRequestDetail?Id=${id}`
  );
};

export const apiFeedbackSupportToOperator = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-cms/services/app/CmsFAQSupport/FeedBackSupportToOperator`,
    params
  );
};

export const apiCloseFAQRequest = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-cms/services/app/CmsFAQSupport/CloseRequest`,
    params
  );
};

export const apiGetFAQSupportListSummary = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-cms/services/app/CmsFAQSupport/GetCmsSupportSummary?MemberId=${params?.MemberId}`
  );
};
