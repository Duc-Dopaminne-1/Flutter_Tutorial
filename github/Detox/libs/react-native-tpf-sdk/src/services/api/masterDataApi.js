import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetMasterData = params => {
  return utils.get(`${AppConfigs.END_POINT}htf-masterdata/services/app/MasterData/GetAll`, params);
};
export const apiGetAllTrigger = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/SdkIntegrationMobileFunction/GetAllTrigger`,
    params
  );
};
export const apiGetFlowByTriggerCode = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/SdkIntegrationMobileFunction/GetFlowByTriggerCode`,
    params
  );
};
export const apiGetProductListByProductCode = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/SdkIntegrationMobileFunction/GetProductListByIntegrationProductCode`,
    params
  );
};
export const apiGetHeaderOfProductCode = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/SdkIntegrationMobileFunction/GetHeaderOfProductCode`,
    params
  );
};
export const apiGetAllMasterData = params => {
  const request = params.map(param => apiGetMasterData(param));
  return utils.getMultiple(request);
};
export const apiGetBecomeTopener = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/SdkIntegrationMobileFunction/GetAllConfigMobile`,
    params
  );
};

export const apiGetInfoService = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/SdkIntegrationMobileFunction/GetFooterConfigForSdk`,
    params
  );
};
export const apiGetListTrigger = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/SdkIntegrationMobileFunction/GetTriggerStage`,
    params
  );
};
