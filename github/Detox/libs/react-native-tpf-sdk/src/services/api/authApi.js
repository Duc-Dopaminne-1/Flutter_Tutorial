import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiCheckMemberIsExist = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/CheckMemberIsExist`,
    params
  );
};

export const apiUpdateReferralCode = params => {
  return utils.put(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/UpdateReferralCode`,
    params
  );
};

export const apiGetAllReferral = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/GetAllReferal`,
    params
  );
};

export const apiGetListReferralByMember = params =>
  utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/GetListReferralByMember`,
    params
  );

export const apiAddReferralCode = params =>
  utils.post(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/AddReferralCode`,
    params
  );
export const apiGetTopenIdUrl = () =>
  utils.get(
    `${AppConfigs.END_POINT}authentication-svc/topenid/v1/get-topenid-url`,
    {},
    { ['app-id']: AppConfigs.AUTHOR_SDK }
  );

export const apiGetPasswordPattern = params => {
  return utils.get(
    `${AppConfigs.END_POINT}authentication-svc/profiles/v5/configurations/password-pattern`,
    params
  );
};

export const apiCheckMemberTopenerByTopenId = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerEntity/GetMemberTopenerByTopenId`,
    params
  );
};

export const apiCheckMemberTopenerByTopenIdV2 = params => {
  return utils.get(
    `${AppConfigs.END_POINT}membertopener-svc/services/app/MemberTopenerEntity/GetMemberTopenerByTopenIdV2`,
    params
  );
};

export const apiGetTopenId = () => {
  return utils.get(`${AppConfigs.END_POINT}authentication-svc/topenid/v1/get-topenid`, {});
};

export const apiUpdatePassword = params => {
  return utils.post(
    `${AppConfigs.END_POINT}authentication-svc/profiles/v5/accounts/update-password?lang=vi`,
    params
  );
};
