import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetPersonalKpiList = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/MobileFunction/GetAllPersonalKPIForMobile`,
    params
  );
};

export const apiGetGroupKpiList = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/MobileFunction/GetAllGroupKPIForMobile`,
    params
  );
};

export const apiGetPersonalKpiStatusSummary = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/MobileFunction/GetTotalPersonalKPI`,
    params
  );
};

export const getPersonalKpiDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/MobileFunction/GetDetailPersonalKPIForMobile`,
    params
  );
};

export const apiGetGroupKpiStatusSummary = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/MobileFunction/GetTotalGroupKPI`,
    params
  );
};

export const getGroupKpiDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/MobileFunction/GetDetailGroupKPIForMobile`,
    params
  );
};
