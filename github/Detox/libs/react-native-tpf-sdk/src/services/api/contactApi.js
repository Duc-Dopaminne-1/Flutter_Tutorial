import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetContacts = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-contact/services/app/ContactEntity/GetContactList`,
    params
  );
};

export const apiGetContactDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-contact/services/app/ContactEntity/GetDetail`,
    params
  );
};
