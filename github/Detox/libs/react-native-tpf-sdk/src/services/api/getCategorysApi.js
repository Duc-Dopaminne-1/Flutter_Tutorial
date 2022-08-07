import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';
export const apiGetCategorysApi = params => {
  return utils.get(`${AppConfigs.END_POINT}htf-cms/services/app/CmsCategory/GetAll`, params);
};
