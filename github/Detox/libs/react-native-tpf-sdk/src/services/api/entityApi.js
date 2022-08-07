import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetEntityForEdit = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-eav/services/app/MobileFunction/GetDetailScreen`,
    params
  );
};
