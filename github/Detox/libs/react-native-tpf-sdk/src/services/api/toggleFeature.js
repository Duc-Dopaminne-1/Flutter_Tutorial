import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetToggleFeature = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/SdkIntegrationMobileFunction/GetFeatureListSdk`,
    params
  );
};
