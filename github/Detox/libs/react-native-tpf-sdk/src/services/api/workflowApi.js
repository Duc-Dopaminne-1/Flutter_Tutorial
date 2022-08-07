import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetNewActionLink = params => {
  return utils.post(`${AppConfigs.END_POINT}elsa/getNextScreen`, params);
};
