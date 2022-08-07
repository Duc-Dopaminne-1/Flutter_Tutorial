import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetLink = params => {
  return utils.get(
    `${AppConfigs.END_POINT}/masterdata-svc/services/app/SdkIntegrationMobileFunction/GetAllConfigMobile`,
    params
  );
};
