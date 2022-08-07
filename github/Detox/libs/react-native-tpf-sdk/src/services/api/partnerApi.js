import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';
export const apiGetPartnerList = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-ecommerce-api/services/app/User/GetPartnerList`,
    params
  );
};
export const apiGetPartnerDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-ecommerce-api/services/app/User/GetPartnerDetail`,
    params
  );
};
