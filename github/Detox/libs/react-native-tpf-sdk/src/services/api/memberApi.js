import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';
import { store } from '../../redux/store/configureStore';

export const apiUpdateProfile = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/EditForMobile`,
    params
  );
};

export const apiGetProfile = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/GetByIdForMobile`,
    params
  );
};

export const apiUploadAvatar = params => {
  return utils.postFormData(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/UploadStorage/Upload`,
    params
  );
};

export const apiGetAgencyInformation = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/GetAgencyInformation`,
    params
  );
};

export const apiGetSubscriptionTopeners = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerSubcriptionTopener/GetAllForMobile`,
    params
  );
};

export const apiGetPolicySubscription = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerSubcriptionTopener/GetPolicySubscription`,
    params
  );
};

export const apiGetMemberProfile = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/GetByIdForMobile`,
    params
  );
};

export const apiPostRenewalTopener = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerSubcriptionTopener/RenewalTopener`,
    params
  );
};

export const apiGetCommissionInformation = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/GetCommissionInformation`,
    params
  );
};

export const apiGetTopenId = id => {
  return utils.getWithoutAcceptText(`${AppConfigs.TOPENID_URL}api/profiles/info/${id}/user`);
};

export const apiUpdateTopendIdInfoForMobile = params => {
  return utils.put(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/UpdateTopendIdInfoForMobile`,
    params
  );
};

export const apiGetAdvanceInfoById = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/GetAdvanceInfoById`,
    params
  );
};
export const apiAcceptLegal = memberId => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/AccepLegal`,
    {
      memberId: memberId
    }
  );
};
export const apiGetImageLegal = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/SdkIntegrationMobileFunction/GetAllConfigMobile`,
    params
  );
};

export const acceptPolicy = () => {
  return utils.put(
    `${AppConfigs.END_POINT}membertopener-svc/services/app/MemberTopenerEntity/AcceptPolicy`
  );
};

export const apiCreateMemberFromSDK = params => {
  return utils.post(
    `${AppConfigs.END_POINT}authentication-svc/topenid/v1/create-member-full-from-sdk`,
    params
  );
};

export const apiCreateTPFMemberFromSDK = params => {
  return utils.post(
    `${AppConfigs.END_POINT}membertopener-svc/services/app/MemberTopenerEntity/CreateMemberFromSDK`,
    params
  );
};

export const apiGetTermInfo = params => {
  return utils.get(
    `${AppConfigs.END_POINT}authentication-svc/profiles/v5/topen-info/terms`,
    params,
    {
      ['app-id']: AppConfigs.AUTHOR_SDK
    }
  );
};

export const apiGetConditionInfo = params => {
  return utils.get(
    `${AppConfigs.END_POINT}authentication-svc/profiles/v5/topen-info/privacy`,
    params,
    {
      ['app-id']: AppConfigs.AUTHOR_SDK
    }
  );
};
