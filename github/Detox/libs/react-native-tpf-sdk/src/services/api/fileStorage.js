import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiUploadFile = params => {
  return utils.postFormData(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/UploadStorage/Upload`,
    params
  );
};

export const apiUploadFileWithDetail = params => {
  return utils.postFormData(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/UploadStorage/UploadFileWithDetail`,
    params
  );
};

export const apiScanIdentityCard = params => {
  return utils.postFormData(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/OCR/GetDataFromFullIdentityCard`,
    params
  );
};
